import admin from "firebase-admin";

/* ================================
   Firebase Admin Initialization
================================ */

// Initialize Firebase Admin using ENV variables (Railway safe)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

/* ================================
   Auth Middleware
================================ */

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ msg: "No token provided ❌" });
    }

    const decoded = await admin.auth().verifyIdToken(token);

    req.user = decoded; // attach logged user
    next();
  } catch (err) {
    console.error("Auth Error:", err.message);
    return res.status(401).json({ msg: "Invalid or expired token ❌" });
  }
};
