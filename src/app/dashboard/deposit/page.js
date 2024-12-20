"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaMoneyBillWave } from "react-icons/fa";

export default function Deposit() {
    const [amount, setAmount] = useState("");
    const { data: session, status } = useSession();
    const router = useRouter();

    // Chequear si estás logueado
    useEffect(() => {
        if (status === "loading") return;
        if (!session) {
            alert("Debes iniciar sesión primero");
            router.push("/login");
            return;
        }
    }, [status, session, router]);

    const handleDeposit = async () => {
        try {
            // Obtén el token JWT de NextAuth (backendToken)
            const token = session?.user?.backendToken;
            if (!token) {
                alert("Debes iniciar sesión primero");
                router.push("/login");
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/account/deposit`
            , {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ amount: parseFloat(amount) }),
            });

            if (res.ok) {
                alert("Depósito realizado con éxito.");
                window.location.reload();
            } else {
                const data = await res.json();
                alert(data.message || "Error al realizar el depósito.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error al realizar el depósito.");
        }
    };

    if (status === "loading") {
        // Pantalla de carga mientras se obtiene el estado de sesión
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <p>Cargando...</p>
            </div>
        );
    }

    return (
        <motion.div
        className="relative min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        >
        <AnimatedBackground />
        <motion.div
        className="relative z-10 w-full max-w-md p-8 bg-white/10 backdrop-blur-md rounded-lg shadow-lg flex flex-col items-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        >
        <FaMoneyBillWave className="text-5xl text-green-400 mb-4" />
        <h1 className="text-3xl font-bold mb-6 text-white">Depósito</h1>
        <div className="flex flex-col items-center gap-4 w-full">
        <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Monto a depositar"
        className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <motion.button
        onClick={handleDeposit}
        className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 w-full font-semibold text-white"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        >
        Realizar Depósito
        </motion.button>
        </div>
        </motion.div>
        </motion.div>
    );
}

// Fondo animado
function AnimatedBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden">
        <motion.div
        className="absolute top-0 left-0 w-[800px] h-[800px] bg-green-700 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"
        />
        <motion.div
        className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-blue-700 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"
        />
        </div>
    );
}
