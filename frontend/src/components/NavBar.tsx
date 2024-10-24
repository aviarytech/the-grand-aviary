import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import '../styles/navbar.css';  // Import your custom CSS file
import { FaUserFriends, FaMapMarkerAlt, FaCogs, FaKey, FaSignOutAlt, FaSignInAlt } from 'react-icons/fa'; // Importing icons
import { useNavigate } from 'react-router-dom';

interface LoggedInUser {
  sub: string;
  email: string;
  name: string;
}

interface NavBarProps {
  loggedInUser: LoggedInUser | null; // Can be null when not logged in
}

const NavBar = ({ loggedInUser }: NavBarProps) => {
    const navigate = useNavigate();

    // Function to handle the login logic
    const handleLogin = () => {
        const returnTo = '/visitors'; // Set the return path after login
        const encodedReturnTo = encodeURIComponent(`${process.env.REACT_APP_BASE_URL}${returnTo}`);
        const loginUrl = `${process.env.REACT_APP_BACKEND_API}/login?returnTo=${encodedReturnTo}`;
        // Redirect to the backend login page
        window.location.href = loginUrl;
    };

    const handleLogout = () => {
        window.location.href = `${process.env.REACT_APP_BACKEND_API}/logout`;
    };

    return (
      <Navbar collapseOnSelect bg="primary" variant="dark" expand="lg" sticky="top" className="mb-4 custom-navbar">
        <Navbar.Brand className="fw-bold text-light">Visitor Management System</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => navigate("visitors")} className="nav-item">
              <FaUserFriends className="me-2" /> Visitors
            </Nav.Link>
            <Nav.Link onClick={() => navigate("locations")} className="nav-item">
              <FaMapMarkerAlt className="me-2" /> Locations
            </Nav.Link>
            <NavDropdown title="VC's" id="collapsible-nav-dropdown" className="nav-item">
              <NavDropdown.Item onClick={() => navigate("activeVC")}>
                <FaKey className="me-2" /> Active
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => navigate("revokedVC")}>
                <FaKey className="me-2" /> Revoked
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link onClick={() => navigate("settings")} className="nav-item">
              <FaCogs className="me-2" /> Settings
            </Nav.Link>
          </Nav>
          <Nav>
            {loggedInUser ? (
              <NavDropdown title={`Welcome, ${loggedInUser.name}`} id="collapsible-nav-dropdown">
                <NavDropdown.Item onClick={handleLogout}>
                  <FaSignOutAlt className="me-2" /> Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link onClick={handleLogin} className="nav-item">
                <FaSignInAlt className="me-2" /> Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
};

export default NavBar;
