"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaExchangeAlt } from "react-icons/fa";

export default function Transfer() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [recipientEmail, setRecipientEmail] = useState("");
    const [amount, setAmount] = useState("");

    const handleTransfer = async () => {
        if (status === "loading") return;
        if (!session) {
            alert("Debes iniciar sesión primero");
            router.push("/login");
            return;
        }

        try {
            const token = session.user?.backendToken;
            const res = await fetch("http://localhost:5000/api/account/transfer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    recipientEmail,
                    amount: parseFloat(amount),
                }),
            });

            if (res.ok) {
                alert("Transferencia realizada con éxito.");
                window.location.reload();
            } else {
                const data = await res.json();
                alert(data.message || "Error al realizar la transferencia.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error al realizar la transferencia.");
        }
    };

    return (
        <motion.div
        className="relative min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white flex items-center justify-center px-4"
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
        <FaExchangeAlt className="text-5xl text-blue-400 mb-4" />
        <h1 className="text-3xl font-bold mb-6 text-white">Transferencia</h1>
        <div className="flex flex-col items-center gap-4 w-full">
        <input
        type="email"
        value={recipientEmail}
        onChange={(e) => setRecipientEmail(e.target.value)}
        placeholder="Correo del destinatario"
        className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Monto a transferir"
        className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <motion.button
        onClick={handleTransfer}
        className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 w-full font-semibold text-white"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        >
        Realizar Transferencia
        </motion.button>
        </div>
        </motion.div>
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
        className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"
        />
        </div>
    );
}
