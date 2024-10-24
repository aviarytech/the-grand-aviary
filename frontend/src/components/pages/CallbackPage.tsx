import React, { useEffect } from 'react';
import { UserManager } from 'oidc-client';

const CallbackPage = () => {
  useEffect(() => {
    const userManager = new UserManager({});
    userManager.signinCallback().then(user => {
      console.log("User from OIDC after callback:", user);
      window.location.href = '/'; // Redirect to home after login
    }).catch(error => {
      console.error("OIDC Callback error:", error);
    });
  }, []);

  return <div>Loading...</div>;
};

export default CallbackPage;
