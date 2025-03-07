import { NextApiRequest, NextApiResponse } from "next";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email et mot de passe requis" });
    }

    // Vérifier si l'utilisateur existe déjà
    const userExist = await pool.query("SELECT * FROM users WHERE email = $1;", [email]);
    if (userExist.rows.length > 0) {
      return res.status(400).json({ error: "Cet email est déjà utilisé." });
    }

    // Hacher le mot de passe avant stockage
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Vérifier si un token admin est envoyé pour créer un admin
    let userRole = "user"; // Par défaut, on crée un utilisateur normal

    if (role === "admin") {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ error: "Seuls les administrateurs peuvent créer d'autres admins." });
      }

      const token = authHeader.split(" ")[1];
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

      if (!decoded || decoded.role !== "admin") {
        return res.status(403).json({ error: "Accès refusé. Seuls les administrateurs peuvent créer un compte admin." });
      }

      userRole = "admin"; // Si l'utilisateur est admin, on autorise la création d'un autre admin
    }

    // Ajouter l'utilisateur en base
    const result = await pool.query(
      "INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role;",
      [email, hashedPassword, userRole]
    );

    res.status(201).json({ message: "Compte créé avec succès", user: result.rows[0] });
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}
