import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import { User } from "../models/users";
import '../styles/navbar.css';  // Import your custom CSS file
import { FaUserFriends, FaMapMarkerAlt, FaCogs, FaKey, FaSignOutAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa'; // Importing icons

interface NavBarProps {
    loggedInUser: User | null,
    onSignUpClicked: () => void,
    onLoginClicked: () => void,
    onLogoutSuccessful: () => void,
    setCurrentPage: (page: string) => void,  
}

const NavBar = ({ loggedInUser, onSignUpClicked, onLoginClicked, onLogoutSuccessful, setCurrentPage }: NavBarProps) => {
    return (
        <Navbar collapseOnSelect bg="primary" variant="dark" expand="lg" sticky='top' className="mb-4 custom-navbar">
            <Navbar.Brand className="fw-bold text-light">Visitor Management System</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link onClick={() => setCurrentPage("visitors")} className="nav-item">
                        <FaUserFriends className="me-2" /> Visitors
                    </Nav.Link>
                    <Nav.Link onClick={() => setCurrentPage("locations")} className="nav-item">
                        <FaMapMarkerAlt className="me-2" /> Locations
                    </Nav.Link>
                    <NavDropdown title="VC's" id="collapsible-nav-dropdown" className="nav-item">
                        <NavDropdown.Item onClick={() => setCurrentPage("activeVC")}>
                            <FaKey className="me-2" /> Active
                        </NavDropdown.Item>
                        <NavDropdown.Item onClick={() => setCurrentPage("revokedVC")}>
                            <FaKey className="me-2" /> Revoked
                        </NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link onClick={() => setCurrentPage("settings")} className="nav-item">
                        <FaCogs className="me-2" /> Settings
                    </Nav.Link>
                </Nav>
                <Nav>
                    {loggedInUser ? (
                        <Nav.Link onClick={onLogoutSuccessful} className="nav-item">
                            <FaSignOutAlt className="me-2" /> Logout
                        </Nav.Link>
                    ) : (
                        <>
                            <Nav.Link onClick={onLoginClicked} className="nav-item">
                                <FaSignInAlt className="me-2" /> Login
                            </Nav.Link>
                            <Nav.Link onClick={onSignUpClicked} className="nav-item">
                                <FaUserPlus className="me-2" /> Sign Up
                            </Nav.Link>
                        </>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default NavBar;
