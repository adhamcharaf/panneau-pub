import { NextApiRequest, NextApiResponse } from "next";
import pool from "../../../../lib/db"; // Connexion à PostgreSQL
import { checkAdmin } from "../../../../lib/auth"; // Vérification admin

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") return res.status(405).json({ error: "Méthode non autorisée" });

  const admin = await checkAdmin(req, res); // Vérification de l'admin
  if (!admin.id) return;

  const { id } = req.query;
  console.log("Tentative de promotion de l'utilisateur ID:", id);

  try {
    // Vérifier si l'utilisateur existe et récupérer son email
    const userCheck = await pool.query("SELECT id, email FROM users WHERE id = $1", [id]);
    if (userCheck.rowCount === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    const userEmail = userCheck.rows[0].email;

    // Mettre à jour le rôle de l'utilisateur
    await pool.query("UPDATE users SET role = 'admin' WHERE id = $1", [id]);

    // Insérer un log de promotion
    await pool.query("INSERT INTO logs (admin_id, user_id, user_email, action) VALUES ($1, $2, $3, $4)",
      [admin.id, id, userEmail, "promote"]);

    return res.json({ message: "Utilisateur promu en administrateur" });
  } catch (error) {
    console.error("Erreur PostgreSQL :", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
