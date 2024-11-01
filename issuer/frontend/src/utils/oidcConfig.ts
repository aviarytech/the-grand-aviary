import { UserManager } from 'oidc-client';

const oidcConfig = {
  authority: process.env.REACT_APP_ISSUER_BASE_URL, // Authentik Issuer URL
  client_id: process.env.REACT_APP_CLIENT_ID, // OIDC Client ID
  redirect_uri: `${process.env.REACT_APP_BACKEND_API}/callback` || 'http://localhost:5000/api/callback', // Redirect after login
  post_logout_redirect_uri: process.env.REACT_APP_BASE_URL || 'http://localhost:3000', // Redirect after logout
  response_type: 'code',
  scope: 'openid profile email',
};

export const userManager = new UserManager(oidcConfig);
