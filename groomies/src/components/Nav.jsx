<<<<<<< HEAD
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { Link, Route, Routes } from 'react-router-dom'

function Nav() {
    return (
      <div className="header">
        <Navbar>
          <Container>
            <Navbar><Link className="a" to="/">Groomies</Link></Navbar>
          </Container>
        </Navbar>
      </div>
    );
  }

  export default Nav;
=======
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useUser } from "../components/UserContext";

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
        <nav className="flex items-center justify-between flex-wrap bg-gray-800 p-6">
            <div className="flex items-center flex-shrink-0 text-white mr-6">
                <Link to="/">
                    <span className="font-semibold text-xl tracking-tight">
                        Groomies
                    </span>
                </Link>
            </div>
            <div className="flex items-center flex-shrink-0 text-white mr-6">
                <Link to="/userprofile">
                    <span className="font-semibold text-xl tracking-tight">
                        Profile
                    </span>
                </Link>
                <Link to="/user/1">
                    Test Profile
                </Link>
            </div>
            <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                <div className="text-sm lg:flex-grow">
                    {user && (
                        <span className="text-white mr-4">
                            Welcome, {user.email}!
                        </span>
                    )}
                </div>
                <div>
                    {user ? (
                        <>
                            <button
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/register">
                            <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                                Login
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
>>>>>>> db7337ae819b22b28b6d3b8872352e41d88f3b5e
