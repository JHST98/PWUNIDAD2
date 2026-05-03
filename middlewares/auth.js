export const isAuthenticated = (req, res, next) => {
  if (req.session.user) return next();
  res.redirect("/login");
};

export const isNotAuthenticated = (req, res, next) => {
  if (!req.session.user) return next();
  res.redirect("/productos");
};