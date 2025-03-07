//(GET : Liste des utilisateurs)

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import pool from "../../../lib/db"; // Importation de la connexion à la base de données

const checkAdmin = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Non autorisé" });

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Accès refusé" });
    }
    return decoded;
  } catch (error) {
    return res.status(401).json({ error: "Token invalide" });
  }
};

// **1️⃣ Récupérer tous les utilisateurs**
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const admin = await checkAdmin(req, res);
    if (!admin.id) return;

    try {
      const result = await pool.query("SELECT id, email, role FROM users");
      return res.json(result.rows);
    } catch (error) {
      console.error("Erreur PostgreSQL :", error);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  }

  res.status(405).json({ error: "Méthode non autorisée" });
}
