import { Button } from "react-bootstrap";

interface NavBarLoggedOutViewProps {
    onSignUpClicked: () => void,
    onLoginClicked: () => void,
}

const NavBarLoggedOutView = ({onSignUpClicked, onLoginClicked}: NavBarLoggedOutViewProps) => {
    return (  
        <>
            <Button onClick={onSignUpClicked}>Sign Up</Button>
            <Button onClick={onLoginClicked}>LogIn</Button>
        </>
    );
}
 
export default NavBarLoggedOutView;