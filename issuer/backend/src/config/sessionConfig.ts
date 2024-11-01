import MongoStore from 'connect-mongo';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';

dotenv.config();

export const sessionConfig = {
  secret: process.env.SESSION_SECRET || randomUUID(),
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_CONNECTION_STRING,
    collectionName: 'sessions',
    ttl: 24 * 60 * 60 // 24 hours
  })
};
