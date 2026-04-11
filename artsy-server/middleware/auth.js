const { admin } = require("../utils/firebaseAdmin");

async function authenticate(req, res, next) {
  const sessionCookie = req.cookies.session;
  if (!sessionCookie) return res.status(401).json({ error: "No session" });

  try {
    req.user = await admin.auth().verifySessionCookie(sessionCookie, true);
    next();
  } catch {
    res.status(401).json({ error: "Invalid session" });
  }
}

module.exports = {
  authenticate,
};
