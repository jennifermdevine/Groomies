import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const UserContext = createContext();

export const useUser = () => {
    return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserData = async (authUserId) => {
        if (!authUserId) {
            setLoading(false);
            return null;
        }

        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('authUserId', authUserId)
                .maybeSingle();

            if (error) throw error;

            setLoading(false);
            return data;
        } catch (error) {
            console.error('Error fetching user data:', error);
            setLoading(false);
            return null;
        }
    };

    useEffect(() => {
        // Check for an existing session when the component mounts
        const session = supabase.auth.session;
        console.log("Initial session:", session);

        if (session) {
            fetchUserData(session.user.id).then(userDetails => {
                setUser(userDetails || session.user);
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    
        const authListener = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("Auth state change event:", event); // Log auth state change
            console.log("Session data:", session); // Log session data
            
            setLoading(true);
            if (session) {
                const userDetails = await fetchUserData(session.user.id);
                setUser(userDetails || session.user);
            } else {
                setUser(null);
            }
            setLoading(false);
        });
    
        return () => {
            if (authListener && typeof authListener.unsubscribe === 'function') {
                authListener.unsubscribe();
            }
        };
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};
