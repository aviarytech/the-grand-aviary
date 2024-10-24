import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const validateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  // Ensure CLIENT_SECRET is defined and handle the case when it's not
  const clientSecret = process.env.CLIENT_SECRET;
  if (!clientSecret) {
    return res.status(500).json({ error: "Client secret is not defined in environment variables" });
  }

  try {
    const decoded = jwt.verify(token, clientSecret);
    req.user = decoded;  // Attach user info from the token to the request
    next();
  } catch (err) {
    console.error("Invalid token:", err);
    return res.status(401).json({ error: "Invalid token" });
  }
};

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.oidc?.isAuthenticated()) {
    return next();
  }
  res.redirect('/api/login'); // Redirect to login if not authenticated
};
