"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaUserCog } from "react-icons/fa";

export default function Profile() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "loading") return;
        if (!session) {
            alert("Debes iniciar sesión primero");
            router.push("/login");
            return;
        }

        const fetchProfile = async () => {
            try {
                const token = session.user?.backendToken;
                const res = await fetch("http://localhost:5000/api/auth/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                setName(data.user.name);
                setEmail(data.user.email);
            } catch (err) {
                console.error("Error al cargar perfil:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [status, session, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = session.user?.backendToken;
            const res = await fetch("http://localhost:5000/api/auth/me", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, email }),
            });
            if (!res.ok) throw new Error("Error al actualizar perfil");
            alert("Perfil actualizado");
        } catch (error) {
            alert(error.message);
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen bg-gray-900 text-white p-6 flex items-center justify-center">
            <p>Cargando...</p>
            </div>
        );
    }

    return (
        <motion.div
        className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-6 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        >
        <AnimatedBackground />
        <motion.form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-lg"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        >
        <div className="flex items-center gap-3 mb-4">
        <FaUserCog className="text-3xl text-blue-400" />
        <h2 className="text-2xl font-bold">Editar Perfil</h2>
        </div>
        <div className="mb-4">
        <label className="block mb-1">Nombre</label>
        <input
        className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={name}
        onChange={(e) => setName(e.target.value)}
        />
        </div>
        <div className="mb-4">
        <label className="block mb-1">Correo</label>
        <input
        className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        />
        </div>
        <motion.button
        type="submit"
        className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 w-full font-semibold"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        >
        Guardar Cambios
        </motion.button>
        </motion.form>
        </motion.div>
    );
}

function AnimatedBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden">
        <motion.div
        className="absolute top-0 left-0 w-[800px] h-[800px] bg-blue-700 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"
        />
        <motion.div
        className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-green-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"
        />
        </div>
    );
}
