import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const UserContext = createContext();

export const useUser = () => {
    return useContext(UserContext);
}

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(supabase.auth.user);

    useEffect(() => {
        const authListener = supabase.auth.onAuthStateChange((event, session) => {
            const currentUser = session?.user;

            setUser(currentUser);
        });

        return () => {
            if (authListener && typeof authListener.unsubscribe === 'function') {
                authListener.unsubscribe();
            }
        };
    }, []);

    return (
        <UserContext.Provider value={{ user }}>
            {children}
        </UserContext.Provider>
    );
}