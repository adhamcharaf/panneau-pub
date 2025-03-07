import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Utilisation de l'URL de connexion
});

export default pool;
