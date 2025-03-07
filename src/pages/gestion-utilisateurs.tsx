import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

interface DecodedToken {
  id: number;
  email: string;
  role: string;
  exp: number;
}

interface User {
  id: number;
  email: string;
  role: string;
}

export default function GestionUtilisateurs() {
  const [users, setUsers] = useState<User[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login"); // 🔄 Redirige les utilisateurs non connectés
      return;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);

      // 🚨 Vérifie si l'utilisateur est admin
      if (decoded.role !== "admin") {
        router.push("/dashboard"); // 🔄 Redirige les non-admin vers le dashboard
        return;
      }

      setLoading(false); // Charge uniquement si l'utilisateur est admin

      // 🛠️ Récupérer les utilisateurs depuis l’API
      axios
        .get("/api/users", { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => setUsers(response.data))
        .catch((error) => console.error("Erreur lors de la récupération des utilisateurs :", error));
      
    } catch (error) {
      console.error("Erreur lors du décodage du token :", error);
      router.push("/login");
    }
  }, [router]);

  if (loading) {
    return <p className="text-center">Chargement...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Gestion des Utilisateurs</h1>
      <button
        onClick={() => router.push("/dashboard")}
        className="mb-4 bg-gray-500 text-white px-4 py-2 rounded"
      >
        Retour au Dashboard
      </button>

      {/* 🔥 Formulaire d'ajout d'utilisateur */}
      <div className="mb-6 p-4 bg-white shadow rounded">
        <h2 className="text-xl font-bold">Ajouter un utilisateur</h2>
        <div className="mt-2">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 mr-2"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 mr-2"
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Ajouter
          </button>
        </div>
      </div>

      {/* Tableau des utilisateurs */}
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Rôle</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border">
              <td className="border px-4 py-2">{user.id}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">{user.role}</td>
              <td className="border px-4 py-2 space-x-2">
                {user.role !== "admin" && (
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded"
                  >
                    Promouvoir
                  </button>
                )}
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
