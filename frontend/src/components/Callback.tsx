import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userManager } from '../utils/oidcConfig'; // Import OIDC config


const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    userManager.signinRedirectCallback()
      .then(user => {
        console.log('User logged in:', user);
        navigate('/visitors'); // Redirect to the visitors page
      })
      .catch(error => {
        console.error('Login callback error:', error);
      });
  }, [navigate]);

  return <p>Logging you in...</p>;
};


export default Callback;
