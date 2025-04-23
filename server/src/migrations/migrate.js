import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "../config/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Runs the database migration by reading SQL statements from a file and executing them sequentially.
 *
 * This will create tables in databse from database.sql file
 *
 * The function reads the content of the `database.sql` file, splits the SQL content by semicolons (`;`),
 * trims each statement, and filters out empty statements. Each valid SQL statement is then executed sequentially
 * using the database connection pool.
 *
 */
async function runMigration() {
  try {
    const sqlFilePath = path.join(__dirname, "database.sql");
    const sqlContent = await fs.readFile(sqlFilePath, "utf8");

    const statements = sqlContent
      .split(";")
      .map((statement) => statement.trim())
      .filter((statement) => statement.length > 0);

    for (const statement of statements) {
      const result = await pool.query(statement);
    }

    console.log("✅ Database migrated successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error running migration:", error);
    process.exit(1);
  }
}

runMigration();
