import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/callback', (req: Request, res: Response) => {
  console.log('Callback query params:', req.query);
  console.log('Session before callback:', req.session);

  res.oidc.callback({ 
    redirectUri: process.env.FRONT + '/callback',
  }).then(() => {
    console.log('OIDC callback successful');

    if (req.oidc.isAuthenticated()) {
      console.log('User authenticated:', req.oidc.user);

      // Access token extraction
      const accessToken = req.oidc.accessToken; // Ensure access token is captured here
      req.session.user = {
        ...req.oidc.user,  // Spread the user object
        access_token: accessToken // Add the access token
      };
      console.log(req.oidc.accessToken);

      req.session.save((err) => {
        if (err) {
          console.error('Error saving session:', err);
          return res.status(500).json({ error: 'Session save error' });
        } else {
          console.log('Session saved successfully');
          //res.redirect(process.env.FRONT + '/'); // Redirect to front-end after successful authentication
        }
      });
    } else {
      console.log('User not authenticated, redirecting to login');
      return res.redirect('/login');
    }
  }).catch((error) => {
    console.error('OIDC callback error:', error);
    return res.status(500).json({ error: 'Authentication failed' });
  });
});



  router.post('/callback', (req, res) => {
    res.oidc.callback({
      redirectUri: 'http://localhost:3000/callback',
    })
  });

// Login route
router.get('/login', (req, res) => {
  const returnTo = req.query.returnTo as string || '/';
  req.session.returnTo = returnTo;

  if(req.oidc.isAuthenticated()) {
    console.log(returnTo);
    
    res.redirect(returnTo);
  } else {    
    res.oidc.login({
      returnTo,
      authorizationParams: {
        redirect_uri: `${process.env.BASE_URL}/api/callback`,
        scope: 'openid profile email',
      }
    });
  }
});



// Logout route
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.oidc.logout({ returnTo: process.env.FRONTEND_URL });
  });
});

// Authentication status route
router.get('/auth-status', (req, res) => {
  const isAuthenticatedOIDC = req.oidc?.isAuthenticated() || false;
  const isAuthenticatedSession = req.session.user !== undefined;

  //console.log('Session User:', req.session.user); // Log session user for debugging

  res.json({
    isAuthenticated: isAuthenticatedOIDC || isAuthenticatedSession,
    method: isAuthenticatedOIDC ? 'oidc' : (isAuthenticatedSession ? 'session' : 'none'),
    user: req.oidc?.user || req.session.user,
    accessToken: isAuthenticatedOIDC ? req.oidc.accessToken : null, // Safe access
  });
});



export default router;
