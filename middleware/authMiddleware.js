import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname usage for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read JSON file manually (no assert needed)
const serviceAccountPath = path.join(__dirname, "../firebase-service-account.json");
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ msg: "No token provided ❌" });

    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded; // attach logged user

    next();
  } catch (err) {
    console.log("Auth Error:", err.message);
    return res.status(401).json({ msg: "Invalid or expired token ❌" });
  }
};
