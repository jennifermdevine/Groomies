import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useUser } from "../components/UserContext";
import logo from "../assets/groomieslogo.png";

export default function Nav() {
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
        <nav className="nav">
            <div className="flex items-center flex-shrink-0 text-white mr-6">
                <span className="titleName">
                    <Link className="a" to="/"><img className="logo" src={logo} alt="Login Illustration" /></Link>
                </span>
            </div>
            <div className="navLinks">
                <Link className="a" to="/">
                    Home
                </Link>
                {user && (
                    <Link className="a" to={`/user/${user.userId}`}>
                        Profile
                    </Link>
                )}
                <Link className="a" to="/groomie/list">
                    Meet The Groomies!
                </Link>
                <Link className="a" to="/calendar">
                    Calendar
                </Link>
                <Link className="a" to="/comingsoon">
                    Coming Soon
                </Link>
            </div>
            <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                <div className="text-sm lg:flex-grow">
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
                        <Link className="a" to="/register">
                            <button className="loginButton">
                                Login
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}