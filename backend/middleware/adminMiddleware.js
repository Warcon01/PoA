exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.email && req.user.email.toLowerCase() === "warconsatofu@gmail.com") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
};
