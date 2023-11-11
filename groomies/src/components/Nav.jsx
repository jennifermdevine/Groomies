//nav.jsx
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useUser } from "../components/UserContext";
import logo from "../assets/groomieslogo.png";

export default function Nav() {
    const { user, setUser } = useUser();
    const navigate = useNavigate();

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            setUser(null);
            navigate("/");
        } else {
            console.error("Error logging out:", error.message);
        }
    };

    return (
        <nav className="nav">
            <div className="flex items-center flex-shrink-0 text-white mr-6">
                <span className="titleName">
                    <Link to="/Home"><img className="logo" src={logo} alt="Login Illustration" /></Link>
                </span>
            </div>
            <div className="navLinks">
                {user && (
                    <Link to={`/user/${user.userId}`}>
                        <span className="font-semibold text-xl tracking-tight">
                            Profile
                        </span>
                    </Link>
                )}
                {user && (
                    <Link to="/EditProfile">
                        <span className="font-semibold text-xl tracking-tight">
                            Edit Profile
                        </span>
                    </Link>
                )}
                <Link to="/groomie/1">
                    Groomie Test Profile
                </Link>
                <Link to="/calendar">
                    <span className="font-semibold text-xl tracking-tight">
                        Calendar
                    </span>
                </Link>
            </div>
            <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                <div className="text-sm lg:flex-grow">
                    {user && (

                        <span className="welcome">
                            Welcome, {user.email}!
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
                        <Link to="/register">
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
