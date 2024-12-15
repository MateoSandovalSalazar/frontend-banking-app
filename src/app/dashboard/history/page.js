"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaHistory } from "react-icons/fa";

export default function History() {
    const [transactions, setTransactions] = useState([]);
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return;
        if (!session) {
            alert("Debes iniciar sesión primero");
            router.push("/login");
            return;
        }

        const fetchHistory = async () => {
            try {
                const token = session.user?.backendToken;
                const res = await fetch("http://localhost:5000/api/account/transactions", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                setTransactions(data.transactions || []);
            } catch (error) {
                console.error("Error al obtener el historial:", error);
            }
        };

        fetchHistory();
    }, [status, session, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <p>Cargando...</p>
            </div>
        );
    }

    return (
        <motion.div
        className="relative min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white p-6 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        >
        <AnimatedBackground />
        <motion.div
        className="relative z-10 w-full max-w-2xl bg-white/10 backdrop-blur-md rounded-lg p-6 shadow-lg"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        >
        <div className="flex items-center gap-2 mb-6">
        <FaHistory className="text-2xl text-blue-400" />
        <h1 className="text-2xl font-bold">Historial de Transacciones</h1>
        </div>
        {transactions.length === 0 ? (
            <p className="text-gray-300">No hay transacciones aún.</p>
        ) : (
            <ul className="space-y-4">
            {transactions.map((transaction, index) => (
                <li
                key={index}
                className="bg-gray-700/50 p-4 rounded shadow-lg flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"
                >
                <span className="uppercase font-semibold text-sm text-gray-300">
                {transaction.type}
                </span>
                <span className="text-lg font-bold text-gray-100">
                ${transaction.amount}
                </span>
                <span className="text-xs text-gray-400">
                {new Date(transaction.date).toLocaleString()}
                </span>
                </li>
            ))}
            </ul>
        )}
        </motion.div>
        </motion.div>
    );
}

function AnimatedBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden">
        <motion.div
        className="absolute top-0 left-0 w-[700px] h-[700px] bg-blue-700 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"
        />
        <motion.div
        className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-purple-700 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"
        />
        </div>
    );
}
