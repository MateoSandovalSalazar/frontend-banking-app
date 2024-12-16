"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AuthErrorContent() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
        <h1 className="text-3xl font-bold">Error de autenticación</h1>
        <p className="mt-4">
        Ocurrió un error durante el proceso de inicio de sesión.
        </p>
        {error && (
            <p className="mt-2 text-red-500">
            Detalles del error: {error}
            </p>
        )}
        <button
        className="mt-6 bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
        onClick={() => (window.location.href = "/login")}
        >
        Volver al login
        </button>
        </div>
    );
}

export default function AuthError() {
    return (
        <Suspense fallback={<div className="text-white">Cargando...</div>}>
        <AuthErrorContent />
        </Suspense>
    );
}
