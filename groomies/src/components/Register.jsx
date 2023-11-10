import { useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Register = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const authListener = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log("Auth state change event:", event);
                console.log("User session data:", session);

                if (event === 'SIGNED_IN') {
                    await createUserProfile(session.user);
                    navigate('/create-profile');
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
      console.log("Creating/updating profile for user:", user);
      try {
          const { data, error } = await supabase
              .from('users')
              .upsert({ // Changed to use upsert method
                  authUserId: user.id,
                  email: user.email 
              }, {
                  onConflict: 'authUserId' // Specify the conflict target column
              });
  
          if (error) throw error;
          console.log('User profile created/updated:', data);
      } catch (error) {
          console.error('Error creating/updating user profile:', error);
      }
  };  

    return (
        <Auth supabaseClient={supabase} />
    );
};

export default Register;
