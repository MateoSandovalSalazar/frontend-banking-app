"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { FaGoogle, FaLock } from "react-icons/fa";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleCredentialsLogin = async (e) => {
        e.preventDefault();
        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
                callbackUrl: "/dashboard",
            });

            if (result.error) {
                alert(result.error);
            } else {
                // Redirige al dashboard o donde indique result.url
                window.location.href = result.url || "/dashboard";
            }
        } catch (error) {
            console.error("Error al iniciar sesión con credenciales:", error);
        }
    };

    const handleGoogleLogin = () => {
        signIn("google", { callbackUrl: "/dashboard" });
    };

    return (
        <motion.div
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        >
        <AnimatedBackground />
        <motion.form
        className="relative z-10 bg-white/10 backdrop-blur-lg p-8 rounded-lg shadow-xl w-full max-w-sm"
        onSubmit={handleCredentialsLogin}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 150 }}
        >
        <div className="flex flex-col items-center mb-6">
        <FaLock className="text-4xl text-blue-400 mb-2" />
        <h2 className="text-3xl font-extrabold text-gray-100">Iniciar Sesión</h2>
        </div>

        <input
        className="border border-gray-600 w-full p-3 rounded-lg mb-4 bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        />

        <input
        className="border border-gray-600 w-full p-3 rounded-lg mb-6 bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        />

        <button
        type="submit"
        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
        >
        Iniciar Sesión
        </button>

        <button
        type="button"
        onClick={handleGoogleLogin}
        className="flex items-center justify-center gap-2 bg-blue-500 text-white w-full py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 mt-4 font-semibold"
        >
        <FaGoogle />
        Iniciar sesión con Google
        </button>
        </motion.form>
        </motion.div>
    );
}

function AnimatedBackground() {
    return (
        <>
        {/* Círculos difuminados animados */}
        <motion.div
        className="absolute top-0 left-0 w-[800px] h-[800px] bg-blue-700 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"
        />
        <motion.div
        className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-purple-700 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"
        />
        </>
    );
}
