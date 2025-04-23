import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Token requerido' });

  try {
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ error: 'Token inválido' });
  }
};

export const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user?.role !== role) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    next();
  };
};
