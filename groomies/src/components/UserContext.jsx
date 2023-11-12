// UserContext.jsx
import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { supabase } from "../supabaseClient";

const UserContext = createContext();

export const useUser = () => {
    return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
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
        const session = supabase.auth.session;
        setUser(session?.user || null);
        setSession(session);
        // console.log("Initial session:", session);

        if (session) {
            fetchUserData(session.user.id).then(userDetails => {
                setUser(userDetails || session.user);
                setLoading(false);
            });
        } else {
            setLoading(false);
        }

        const authListener = supabase.auth.onAuthStateChange(async (event, session) => {
            // console.log("Auth state change event:", event);
            // console.log("Session data:", session);

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

    const contextValue = useMemo(() => ({ user, session }), [user, session]);

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};
