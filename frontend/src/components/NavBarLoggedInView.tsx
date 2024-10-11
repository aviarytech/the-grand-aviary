import { Button, Navbar } from "react-bootstrap";
import { User } from "../models/users";
import * as VisitorsApi from "../network/visitor_api";

interface NavBarLoggedInViewProps {
    user: User,
    onLogoutSuccessful: () => void,
}

const NavBarLoggedInView = ({user, onLogoutSuccessful}: NavBarLoggedInViewProps) => {
    async function logout() {
        try {
            await VisitorsApi.logout();
            onLogoutSuccessful();
        } catch (error) {
            console.log(error);
            alert(error);            
        }
    }

    return ( 
        <>
            <Navbar.Text className="me-2">
                Signed in as: {user.username}
            </Navbar.Text>
            <Button onClick={logout}>Logout</Button>
        </>
    );
}
 
export default NavBarLoggedInView;