import { NextApiRequest, NextApiResponse } from "next"; 
import pool from "@/lib/db";
import jwt from "jsonwebtoken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    // Vérifier si le token est fourni dans l'en-tête Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Accès refusé. Token manquant." });
    }

    const token = authHeader.split(" ")[1];

    // Vérifier et décoder le token JWT
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

    if (!decoded || decoded.role !== "admin") {
      return res.status(403).json({ error: "Accès refusé. Seuls les administrateurs peuvent ajouter des panneaux." });
    }

    // Extraire les données du panneau à ajouter
    const { latitude, longitude, adresse, type, dimensions, prix, regie } = req.body;

    if (!latitude || !longitude || !adresse || !type || !dimensions || !prix || !regie) {
      return res.status(400).json({ error: "Tous les champs sont obligatoires" });
    }

    // Ajouter le panneau dans la base de données
    const result = await pool.query(
      `INSERT INTO panneaux (latitude, longitude, adresse, type, dimensions, prix, regie) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *;`,
      [latitude, longitude, adresse, type, dimensions, prix, regie]
    );

    const panneau = result.rows[0];

    // Insérer un log d'action pour tracer l'ajout du panneau
    await pool.query(
      `INSERT INTO logs (admin_id, action) 
       VALUES ($1, $2);`,
      [decoded.id, "add_panneau"]
    );
    
    res.status(201).json({ message: "Panneau ajouté avec succès", panneau });
  } catch (error) {
    console.error("Erreur lors de l'ajout du panneau :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}
