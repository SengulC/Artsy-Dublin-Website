exports.checkAuth = (req, res) => {
  if (req.session && req.session.user) {
    res.json({
      isLoggedIn: true,
      username: req.session.user.name,
    });
  } else {
    res.json({
      isLoggedIn: false,
    });
  }
};
