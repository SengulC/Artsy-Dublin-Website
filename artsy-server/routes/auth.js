const admin = require("firebase-admin");

exports.checkAuth = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.json({ isLoggedIn: false });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    res.json({ isLoggedIn: true, username: decoded.name });
  } catch {
    res.json({ isLoggedIn: false });
  }
};
