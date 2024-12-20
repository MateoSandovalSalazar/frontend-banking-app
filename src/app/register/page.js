"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaUserPlus } from "react-icons/fa";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`
            , {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });

            if (res.ok) {
                alert("Registro exitoso. Ahora puedes iniciar sesión.");
                window.location.href = "/login";
            } else {
                const data = await res.json();
                alert(data.message || "Error al registrar.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error al registrar.");
        }
    };

    return (
        <motion.div
        className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col items-center justify-center px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        >
        <AnimatedBackground />
        <motion.form
        className="relative z-10 bg-white/10 backdrop-blur-xl p-8 rounded-lg shadow-xl max-w-md w-full"
        onSubmit={handleSubmit}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        >
        <div className="flex flex-col items-center mb-6">
        <FaUserPlus className="text-4xl text-blue-400 mb-2" />
        <h2 className="text-3xl font-extrabold text-white text-center">Crea tu cuenta</h2>
        </div>

        <input
        className="w-full p-3 mb-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        />
        <input
        className="w-full p-3 mb-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        />
        <input
        className="w-full p-3 mb-6 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        />
        <button
        type="submit"
        className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 font-semibold"
        >
        Registrarse
        </button>
        </motion.form>

        <p className="relative z-10 mt-4 text-gray-400 text-sm">
        ¿Ya tienes una cuenta?{" "}
        <a
        href="/login"
        className="text-blue-400 hover:text-blue-500 underline transition-colors duration-200"
        >
        Inicia sesión
        </a>
        </p>
        </motion.div>
    );
}

function AnimatedBackground() {
    return (
        <>
        <motion.div
        className="absolute top-0 left-0 w-[800px] h-[800px] bg-blue-700 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"
        />
        <motion.div
        className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-indigo-700 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"
        />
        </>
    );
}
