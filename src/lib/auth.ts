import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import pool from "./db"; // Connexion à PostgreSQL

export async function checkAuth(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Non autorisé" });

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

    // Vérifier si l'utilisateur existe encore en BDD
    const userCheck = await pool.query("SELECT id, role FROM users WHERE id = $1", [decoded.id]);
    if (userCheck.rowCount === 0) {
      return res.status(403).json({ error: "Utilisateur inexistant" });
    }

    return userCheck.rows[0]; // Renvoie l'utilisateur et son rôle
  } catch (error) {
    return res.status(401).json({ error: "Token invalide" });
  }
}

// Vérification spécifique pour les routes Admin
export async function checkAdmin(req: NextApiRequest, res: NextApiResponse) {
  const user = await checkAuth(req, res);
  if (!user || user.role !== "admin") {
    return res.status(403).json({ error: "Accès refusé, administrateur requis" });
  }
  return user;
  
}
