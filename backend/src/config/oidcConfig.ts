import { ConfigParams } from 'express-openid-connect';
import dotenv from 'dotenv';

dotenv.config();

export const oidcConfig: ConfigParams = {
  authRequired: false,
  //auth0Logout: true,
  secret: process.env.CLIENT_SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID!,
  issuerBaseURL: `${process.env.ISSUER_BASE_URL}/.well-known/openid-configuration`,
  routes: {
    postLogoutRedirect: process.env.FRONT,
    login: false, // Define your login route
    callback: false, // Redirect here after logout
    logout: false
  },
  authorizationParams: {
    response_type: 'code',
    scope: 'openid profile email',
    redirect_uri:`${process.env.BASE_URL}/callback`,
  },
};