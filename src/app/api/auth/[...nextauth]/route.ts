// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(credentials),
                    });

                    const data = await res.json();
                    if (!res.ok) {
                        throw new Error(data.message || "Credenciales inválidas");
                    }
                    // data = { token, user: {id, name, email, balance?}, ...}
                    return {
                        id: data.user.id,
                        name: data.user.name,
                        email: data.user.email,
                        balance: data.user.balance,
                        backendToken: data.token,
                    };
                } catch (err) {
                    console.error("Error en CredentialsProvider:", err);
                    return null;
                }
            },
        }),

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            profile(profile) {
                // Mapea el perfil devuelto por Google
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                };
            },
        }),
    ],

    callbacks: {
        // *** Este callback se llama antes de 'jwt' y 'session' ***
        async signIn({ user, account }) {
            // Solo hacer la unificación con backend si el provider es google
            if (account.provider === "google") {
                try {
                    // user = { id, name, email, image } (de profile() )
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/googleLogin`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: user.email, name: user.name }),
                    });
                    const data = await res.json();

                    if (!res.ok) {
                        console.error("Error googleLogin backend:", data);
                        return false; // Cancela el login
                    }

                    // data = { token, user: {id, name, email, balance} }
                    // Sobre-escribimos user.* para que 'jwt' callback tenga la info
                    user.id = data.user.id;
                    user.name = data.user.name;
                    user.email = data.user.email;
                    user.balance = data.user.balance;
                    user.backendToken = data.token;

                    return true;
                } catch (error) {
                    console.error("Error unificando Google user en backend:", error);
                    return false;
                }
            }
            return true; // CredentialsProvider o cualquier otro provider pasa
        },

        async jwt({ token, user, account }) {
            // Para Google
            if (account?.provider === "google" && user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.balance = user.balance ?? 0;
                token.backendToken = user.backendToken; // JWT desde tu backend
            }
            // Para credenciales
            if (user?.backendToken) {
                token.backendToken = user.backendToken;
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.balance = user.balance ?? 0;
            }
            return token;
        },

        async session({ session, token }) {
            session.user.id = token.id ?? null;
            session.user.name = token.name ?? null;
            session.user.email = token.email ?? null;
            session.user.balance = token.balance ?? 0;
            session.user.backendToken = token.backendToken ?? null;
            session.user.googleAccessToken = token.accessToken ?? null; // opcional
            return session;
        },

        async redirect({ url, baseUrl }) {
            return url.startsWith(baseUrl) ? url : `${baseUrl}/dashboard`;
        },
    },

    pages: {
        signIn: "/login",
        error: "/auth/error",
    },

    secret: process.env.NEXTAUTH_SECRET,
};

// Handler App Router
const handler = NextAuth(authOptions);
export const GET = handler;
export const POST = handler;
