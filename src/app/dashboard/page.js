"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
    UserCircleIcon,
    ArrowUpOnSquareIcon,
    ClockIcon,
    BanknotesIcon,
    ArrowDownOnSquareIcon,
} from "@heroicons/react/24/outline"; // Ejemplo de iconos HeroIcons

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [loadingUserData, setLoadingUserData] = useState(true);

    useEffect(() => {
        if (status === "loading") return; // Espera a que NextAuth cargue la sesión

        if (!session) {
            alert("Debes iniciar sesión primero");
            router.push("/login");
        }
    }, [status, session, router]);

    useEffect(() => {
        // Solo fetch si tenemos un token del backend
        if (!session?.user?.backendToken) {
            setLoadingUserData(false);
            return;
        }

        const fetchUser = async () => {
            try {
                const token = session.user.backendToken;
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error("No autorizado o token inválido");
                }

                const data = await res.json();
                if (data.user) {
                    setUser(data.user);
                } else {
                    throw new Error("Usuario no encontrado");
                }
            } catch (err) {
                console.error("Error al obtener datos del usuario:", err);
                setError("Error al obtener los datos del usuario");
            } finally {
                setLoadingUserData(false);
            }
        };

        fetchUser();
    }, [session]);

    if (status === "loading" || loadingUserData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
            <p className="text-lg animate-pulse">Cargando...</p>
            </div>
        );
    }

    if (!session) {
        return null; // Se redirige en el useEffect
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
            <p>{error}</p>
            </div>
        );
    }

    return (
        <motion.div
        className="relative min-h-screen flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        >
        {/* FONDO ANIMADO */}
        <AnimatedGradientBackground />

        {/* HEADER */}
        <header className="relative z-10 p-6 flex justify-between items-center bg-white/10 backdrop-blur-sm shadow-md">
        <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        {user?.name && (
            <motion.span
            className="text-sm text-gray-200 px-2 py-1 rounded-lg bg-white/5"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            >
            Bienvenido, {user.name}
            </motion.span>
        )}
        </div>

        <div className="flex items-center gap-6">
        {user && (
            <motion.span
            className="text-sm text-gray-200 px-3 py-1 rounded-lg bg-emerald-600/80 hover:bg-emerald-600/95 transition-colors"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            >
            Saldo: ${user.balance ?? 0}
            </motion.span>
        )}
        <button
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        onClick={() => signOut({ callbackUrl: "/login" })}
        >
        Cerrar sesión
        </button>
        </div>
        </header>

        {/* MAIN */}
        <main className="relative z-10 flex-1 p-8">
        <h2 className="text-3xl font-semibold mb-8 text-white/90">Opciones</h2>

        <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
                opacity: 1,
            y: 0,
            transition: {
                delayChildren: 0.2,
            staggerChildren: 0.1,
            },
            },
        }}
        >
        <Card
        title="Perfil"
        description="Edita tu información personal"
        link="/dashboard/profile"
        icon={<UserCircleIcon className="h-6 w-6" />}
        />
        <Card
        title="Transferencias"
        description="Realiza transferencias a otros usuarios"
        link="/dashboard/transfer"
        icon={<ArrowUpOnSquareIcon className="h-6 w-6" />}
        />
        <Card
        title="Historial"
        description="Consulta tus transacciones pasadas"
        link="/dashboard/history"
        icon={<ClockIcon className="h-6 w-6" />}
        />
        <Card
        title="Depósito"
        description="Añade dinero a tu cuenta"
        link="/dashboard/deposit"
        icon={<BanknotesIcon className="h-6 w-6" />}
        />
        <Card
        title="Retiro"
        description="Retira dinero de tu cuenta"
        link="/dashboard/withdraw"
        icon={<ArrowDownOnSquareIcon className="h-6 w-6" />}
        />
        </motion.div>
        </main>
        </motion.div>
    );
}

// COMPONENTE CARD
function Card({ title, description, link, icon }) {
    return (
        <motion.a
        href={link}
        className="group relative p-6 rounded-lg shadow-lg
        bg-white/10 backdrop-blur-sm
        hover:bg-white/20 transition-colors duration-300 overflow-hidden"
        variants={{
            hidden: { opacity: 0, y: 15 },
            visible: { opacity: 1, y: 0 },
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        >
        <div className="flex flex-col gap-2 text-white">
        <div className="flex items-center gap-2">
        <div className="h-9 w-9 bg-emerald-500 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
        {icon}
        </div>
        <h3 className="text-lg font-bold">{title}</h3>
        </div>
        <p className="text-sm text-gray-300 mt-2">{description}</p>
        </div>
        </motion.a>
    );
}

// BACKGROUND GRADIENT ANIMADO - "nivel top"
function AnimatedGradientBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden">
        <motion.div
        className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-r
        from-indigo-600 via-purple-600 to-pink-600
        opacity-50"
        initial={{ scale: 1 }}
        animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 15, -10, 0],
            transition: {
                duration: 20,
                repeat: Infinity,
                repeatType: "reverse",
            },
        }}
        />
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/60" />
        </div>
    );
}
