import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: number;
  email: string;
  role: string;
  exp: number;
}

export default function Dashboard() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);
      setUserRole(decoded.role);

      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        router.push("/login");
      }
    } catch (error) {
      console.error("Erreur lors du décodage du token :", error);
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold">Bienvenue sur le Dashboard</h1>
      <p className="mt-4 text-lg">
        Votre rôle : <strong>{userRole}</strong>
      </p>

      {userRole === "admin" ? (
        <div className="mt-6 bg-white p-4 rounded shadow-lg">
          <h2 className="text-xl font-bold">Actions Admin</h2>
          {/* Ajoutez ici les boutons ou les liens pour les actions spécifiques à l'admin */}

          {/*bouton pour la gestion des utilisateurs */}
          <button
            onClick={() => router.push("/gestion-utilisateurs")}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Gestion des utilisateurs
          </button>
        </div>
      ) : (
        <p className="mt-6 text-gray-700">Vous êtes un utilisateur normal.</p>
      )}

      <button
        onClick={() => {
          localStorage.removeItem("token");
          router.push("/login");
        }}
        className="mt-6 bg-red-500 text-white px-4 py-2 rounded"
      >
        Déconnexion
      </button>
    </div>
  );
}
