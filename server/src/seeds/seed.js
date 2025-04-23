import bcrypt from "bcryptjs";
import { pool } from "../config/database.js";

const seedAdminUser = async () => {
	try {
		const name = "Admin";
		const email = "admin@vaccino.com";
		const password = "admin123";
		const dob = "1990-01-01";
		const gender = "Male";
		const address = "Admin HQ";
		const phone = "9800000000";
		const avatar = null;
		const role = "Admin";

		const [existing] = await pool.query("SELECT * FROM users WHERE email = ?", [
			email
		]);

		if (existing.length > 0) {
			console.log("Admin user already exists.");
			return;
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		await pool.query(
			`INSERT INTO users (name, email, password, dob, gender, role, address, phone, avatar)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[name, email, hashedPassword, dob, gender, role, address, phone, avatar]
		);

		console.log("✅ Admin user seeded successfully.");
		process.exit(0);
	} catch (err) {
		console.error("❌ Error seeding admin user:", err);
		process.exit(1);
	}
};

seedAdminUser();
