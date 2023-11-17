import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useUser } from "../components/UserContext";
import logo from "../assets/groomieslogo.png";
import Nav from 'react-bootstrap/Nav';
import '../components/NavCSS.css';

export default function Navbar() {
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
        <div className="nav-container">
        <Nav className="navbar" fill variant="underline">
                <span className="titleName">
                    <Nav.Item>
                    <Nav.Link className="a" href="/"><img className="logo" src={logo} alt="Login Illustration" />
                    </Nav.Link>
                    </Nav.Item>
                </span>
                <Nav.Item>
                <Nav.Link className="a" href="/">
                    Home
                </Nav.Link>
                </Nav.Item>
                {user && (
                    <Nav.Item>
                    <Nav.Link className="a" href={`/user/${user.userId}`}>
                        Profile
                    </Nav.Link>
                    </Nav.Item>
                )}
                <Nav.Item>
                <Nav.Link className="a" href="/groomie/list">
                    Meet The Groomies!
                </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                <Nav.Link className="a" href="/calendar">
                    Calendar
                </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                <Nav.Link className="a" href="/reviews">
                    Reviews
                </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                <Nav.Link className="a" href="/comingsoon">
                    Coming Soon
                </Nav.Link>
                </Nav.Item>
            <div>
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
            </div>
        </Nav>
        </div>

    );
}