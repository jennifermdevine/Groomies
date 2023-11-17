import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useUser } from "../components/UserContext";
import logo from "../assets/groomieslogo.png";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import '../components/NavCSS.css';
import Offcanvas from 'react-bootstrap/Offcanvas';

export default function Navigation() {
    const { user } = useUser();
    const navigate = useNavigate();

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            navigate("/");
        } else {
            console.error("Error logging out:", error.message);
        }
    };

    return (
        <Navbar collapseOnSelect expand="lg" variant="dark" className="nav-container">
            <Container>
                <Navbar.Brand href="/"><img className="logo" src={logo} alt="groomies logo"></img></Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="navbar" fill variant="underline">
                    <Nav.Link className="a" href="/"> Home </Nav.Link>
                    {user && (
                    <Nav.Link className="a" href={`/user/${user.userId}`}> Profile </Nav.Link> )}
                    <Nav.Link className="a" href="/groomie/list"> Meet The Groomies! </Nav.Link>
                    <Nav.Link className="a" href="/calendar"> Calendar </Nav.Link>
                    <Nav.Link className="a" href="/reviews"> Reviews </Nav.Link>
                    <Nav.Link className="a" href="/comingsoon"> Coming Soon </Nav.Link>
            <div>
            {user && (
                        <span className="welcome">
                            Welcome, {user.userName ? user.userName : user.email}!
                        </span>
                    )}
            </div>
            <div>
                    {user ? (
                        <>
                            <button
                                className="logoutButton"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Nav.Link className="a" href="/register">
                            <button className="loginButton">
                                Login <br/>
                                or sign up here!
                            </button>
                        </Nav.Link>
                    )}
                </div>
                </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}