import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import { useState, useEffect } from "react";

const Navbar = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/api/logout"); // Appelle l'API de déconnexion
      localStorage.removeItem("token"); // Supprime le token du stockage local
      setIsLoggedIn(false);
      router.push("/login"); // Redirige vers la page de connexion
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  return (
    <nav style={{ display: "flex", justifyContent: "space-between", padding: "10px", background: "#333", color: "#fff" }}>
      <Link href="/" style={{ color: "#fff", textDecoration: "none", fontSize: "18px" }}>
        Accueil
      </Link>
      {isLoggedIn ? (
        <button onClick={handleLogout} style={{ background: "red", color: "#fff", border: "none", padding: "8px 12px", cursor: "pointer" }}>
          Déconnexion
        </button>
      ) : (
        <Link href="/login" style={{ color: "#fff", textDecoration: "none" }}>
          Connexion
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
