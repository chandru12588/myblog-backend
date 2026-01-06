import admin from "firebase-admin";

/* ================= FIREBASE ADMIN INIT ================= */
let firebaseReady = false;

if (!admin.apps.length) {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error("Missing Firebase environment variables");
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });

    firebaseReady = true;
    console.log("✅ Firebase Admin initialized successfully");
  } catch (error) {
    console.error("❌ Firebase Admin INIT FAILED:", error.message);
  }
} else {
  firebaseReady = true;
}

/* ================= AUTH MIDDLEWARE ================= */
export const protect = async (req, res, next) => {
  try {
    if (!firebaseReady) {
      console.error("❌ Firebase Admin not initialized");
      return res.status(500).json({
        message: "Server auth configuration error",
      });
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = await admin.auth().verifyIdToken(token);

    if (!decoded || !decoded.uid) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ AUTH ERROR:", err.message);
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
