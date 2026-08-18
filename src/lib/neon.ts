/**
 * Neon HTTP SQL client
 * Uses HTTPS (port 443) — works on ALL networks including those blocking port 5432.
 * Use this for any DB operation that must work on restricted networks.
 */
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export default sql;
