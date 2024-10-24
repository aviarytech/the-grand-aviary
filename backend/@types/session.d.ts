import mongoose from "mongoose";
import 'express-session';

declare module "express-session" {
  interface SessionData {
    userId: mongoose.Types.ObjectId; // User ID
    user: unknown; // You can specify the user type more explicitly if you wish
    returnTo: string; // For redirecting after authentication
    state?: string; // Add state as an optional property
  }
}
