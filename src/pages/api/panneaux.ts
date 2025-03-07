import { NextApiRequest, NextApiResponse } from "next";
import pool from "@/lib/db"; // Import de la connexion PostgreSQL

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const result = await pool.query("SELECT * FROM panneaux;");
    res.status(200).json(result.rows); // Renvoie tous les panneaux en JSON
  } catch (error) {
    console.error("Erreur lors de la récupération des panneaux :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}
