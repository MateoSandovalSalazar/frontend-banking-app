"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaUser, FaUserPlus } from "react-icons/fa";

export default function Home() {
  const router = useRouter();

  return (
    <motion.div
    className="relative min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white flex flex-col items-center justify-center overflow-hidden"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
    >
    {/* Fondo animado */}
    <AnimatedBackground />

    {/* Contenido principal */}
    <motion.header
    className="relative z-10 text-center max-w-2xl"
    initial={{ y: -30, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.3 }}
    >
    <h1 className="text-5xl sm:text-7xl font-extrabold text-white">
    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
    Bienvenido a Elite Bank
    </span>
    </h1>
    <p className="mt-4 text-lg sm:text-xl text-gray-300">
    Gestiona tu dinero de manera segura, rápida y moderna.
    </p>
    </motion.header>

    {/* Botones */}
    <motion.div
    className="relative z-10 flex flex-col sm:flex-row gap-8 mt-16"
    initial={{ y: 30, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.5 }}
    >
    <motion.button
    className="flex items-center justify-center gap-3 px-8 py-3 bg-purple-600 text-white font-bold rounded-lg shadow-lg hover:bg-purple-700 transition-all duration-300"
    onClick={() => router.push("/login")}
    whileHover={{ scale: 1.1 }}
    >
    <FaUser size={20} />
    Iniciar Sesión
    </motion.button>

    <motion.button
    className="flex items-center justify-center gap-3 px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 transition-all duration-300"
    onClick={() => router.push("/register")}
    whileHover={{ scale: 1.1 }}
    >
    <FaUserPlus size={20} />
    Registrarse
    </motion.button>
    </motion.div>

    {/* Footer */}
    <footer className="absolute bottom-4 text-gray-400 text-sm z-10">
    &copy; 2024 Elite Bank. Todos los derechos reservados.
    </footer>
    </motion.div>
  );
}

// Fondo animado con Framer Motion
function AnimatedBackground() {
  return (
    <motion.div
    className="absolute inset-0"
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.5 }}
    transition={{ duration: 1, repeat: Infinity, repeatType: "mirror" }}
    >
    <motion.div
    className="absolute -top-1/2 -left-1/2 w-[1000px] h-[1000px] bg-purple-700 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"
    />
    <motion.div
    className="absolute -bottom-1/2 -right-1/3 w-[800px] h-[800px] bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"
    />
    </motion.div>
  );
}
