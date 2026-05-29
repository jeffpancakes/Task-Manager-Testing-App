export function requireUserId(req, res, next) {
  const userId = req.header('x-user-id');

  if (!userId) {
    return res.status(401).json({
      message: 'Uživatel není přihlášen.',
    });
  }

  req.userId = userId;
  next();
}