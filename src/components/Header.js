"use client";

export default function Header({ user }) {
    return (
        <header className="p-4 bg-gray-700 shadow-lg flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">Dashboard</h1>
        {user ? (
            <div className="flex items-center gap-4">
            <div className="text-sm text-white">
            <span>Bienvenido, {user.name}</span>
            <br />
            <span>Saldo: ${user.balance}</span>
            </div>
            <button
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
            }}
            >
            Cerrar sesión
            </button>
            </div>
        ) : (
            <span className="text-sm text-white">Cargando...</span>
        )}
        </header>
    );
}

