import React, { useEffect, useState } from 'react';
import { UserManager, WebStorageStateStore } from 'oidc-client-ts'; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VisitorsPage from './components/pages/VisitorPage';
import LocationsPage from './components/pages/LocationPage';
import RevokedVCPage from './components/pages/RevokedVCPage';
import ActiveVCPage from './components/pages/ActiveVCPage';
import NotFound from './components/pages/NotFound';
import CallbackPage from './components/pages/CallbackPage';
import NotLoggedInPage from './components/pages/NotLoggedInPage';
import NavBar from './components/NavBar';
import * as VisitorsApi from './network/visitor_api';
import * as LocationsApi from './network/location_api';
import { Visitor } from './models/visitor';
import { Location } from './models/location';
//import jwt from 'jsonwebtoken';

// OIDC configuration
const userManager = new UserManager({
  authority: process.env.REACT_APP_ISSUER_BASE_URL || " ",
  client_id: process.env.REACT_APP_CLIENT_ID || " ",
  redirect_uri: `${process.env.REACT_APP_BACKEND_API}/callback` || 'http://localhost:5000/api/callback',
  post_logout_redirect_uri: `${process.env.REACT_APP_BASE_URL}/logout` || 'http://localhost:3000/logout',
  response_type: 'code',
  scope: 'openid profile email',
  metadata: {
    issuer: process.env.REACT_APP_ISSUER_BASE_URL, 
    authorization_endpoint: process.env.REACT_APP_AUTHEND, 
    userinfo_endpoint: process.env.REACT_APP_USEREND, 
    end_session_endpoint: process.env.REACT_APP_ENDSESSIONENDPOINT
  },
  userStore: new WebStorageStateStore({ store: window.localStorage })
});

function App() {
  const [loggedInUser, setLoggedInUser] = useState<any>(null);  // Track OIDC user
  const [accessToken, setAccessToken] = useState<string | null>(null); // Track OIDC access token
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  // Fetch authentication status
  useEffect(() => {
    async function fetchAuthStatus() {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/auth-status`, {
        credentials: 'include', // Include credentials to allow cookies/session data
      });
      if (response.ok) {
        const data = await response.json();
        if (data.isAuthenticated) {
          setLoggedInUser({
            sub: data.user.sub,
            email: data.user.email,
            name: data.user.name
          }); // Set user information in state
          setAccessToken(data.accessToken); // Set the access token
        } else {
          setLoggedInUser(null);
          setAccessToken(null);
        }
      } else {
        console.error("Failed to fetch auth status");
      }
    }
    
    fetchAuthStatus();
  }, []);

  // Handle login with OIDC
  useEffect(() => {
    async function getUser() {
      const user = await userManager.getUser();
      console.log("User from OIDC:", user);
      if (user && !user.expired ) {
        setLoggedInUser(user.profile);
        setAccessToken(user.access_token); // Store access token
      } else {
        setLoggedInUser(null);
        setAccessToken(null); // Reset access token
      }
    }
    getUser();
  }, []);

  // Load visitors and locations when logged in and access token is available
  useEffect(() => {
    async function loadUserData() {
      try {
        if (loggedInUser && accessToken) {
          // Fetch visitors and locations with the access token in headers
          const visitorsData = await VisitorsApi.fetchVisitors(accessToken);
          const filteredVisitors = visitorsData.filter((visitor: Visitor) => visitor.createdBy === loggedInUser.sub);
          setVisitors(filteredVisitors);
  
          const locationsData = await LocationsApi.fetchLocations(accessToken);
          const filteredLocations = locationsData.filter((location: Location) => location.createdBy === loggedInUser.sub);
          setLocations(filteredLocations);
        }
      } catch (error) {
        console.error("Error loading user data: ", error);
      }
    }
  
    loadUserData();
  }, [loggedInUser, accessToken]);
  
  return (
    <Router>
      <NavBar loggedInUser={loggedInUser} />
      <Routes>
        {loggedInUser ? (
          <>
            <Route path="/" element={<VisitorsPage visitors={visitors} />} />
            <Route path="/visitors" element={<VisitorsPage visitors={visitors} />} />
            <Route path="/locations" element={<LocationsPage locations={locations} />} />
            <Route path="/activeVC" element={<ActiveVCPage />} />
            <Route path="/revokedVC" element={<RevokedVCPage />} />
          </>
        ) : (
          <>
            <Route path="/callback" element={<CallbackPage />} />
            <Route path="/pleaseLogin" element={<NotLoggedInPage />} />
          </>
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
