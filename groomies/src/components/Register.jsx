import { useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Register.css';

const Register = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const authListener = supabase.auth.onAuthStateChange(
            async (event, session) => {

                if (event === 'SIGNED_IN') {
                    await createUserProfile(session.user);
                    navigate(`/user/${session.user.id}`);
                }
            }
        );

        return () => {
            if (authListener && typeof authListener.unsubscribe === 'function') {
                authListener.unsubscribe();
            }
        };
    }, [navigate]);

    const createUserProfile = async (user) => {
        try {
            const { data, error } = await supabase
                .from('users')
                .upsert({
                    authUserId: user.id,
                    email: user.email
                }, {
                    onConflict: 'authUserId'
                });

            if (error) {
                console.error('Error in upsert operation:', error);
                return;
            }
        } catch (error) {
            console.error('Error creating/updating user profile:', error);
        }
    };

    return (
            <Auth supabaseClient={supabase} />
    );
};

export default Register;