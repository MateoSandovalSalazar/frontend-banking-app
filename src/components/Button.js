export default function Button({ children, onClick, type = "button", className }) {
    return (
        <Button
        onClick={() => {
            window.location.href = "/api/auth/signin/google"; // Endpoint correcto de NextAuth
        }}
        className="bg-blue-500 text-white w-full py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 mt-4"
        >
        Iniciar sesión con Google
        </Button>

    );
}
