import { useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Helmet } from "react-helmet-async";


// const getUserImage = async (path) => {

// };

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: "" };
    case 'FETCH_SUCCESS':
      return { ...state, user: action.payload, loading: false, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    case 'TOGGLE_EDIT':
      return { ...state, isEditing: !state.isEditing };
    default:
      return state;
  }
};

export default function UserProfile() {
  const { userId } = useParams();

  const [{ user, loading, error }, dispatch] = useReducer(reducer, {
    user: {},
    loading: false,
    error: '',
    isEditing: false,
  });

  useEffect(() => {
    const fetchUsers = async () => {

      dispatch({ type: 'FETCH_REQUEST' });
      const { data, error } = await supabase
        .from('users')
        .select()
        .eq('userId', userId);
      if (error) {
        dispatch({ type: 'FETCH_FAIL', payload: error.message })
      } else if (data && data.length > 0) {
        dispatch({ type: 'FETCH_SUCCESS', payload: data[0] })
      } else {
        console.log(`No data returned from Supabase for userId: ${userId}`);
        dispatch({ type: 'FETCH_FAIL', payload: 'No user found' })
      }
    };
      fetchUsers();
  }, [userId]);

  return (
    <div>
      <h1>User Profile</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {user.userName && (
        <div>
          <Helmet>
            <title>{user.userName} | Groomies</title>
          </Helmet>
          <h2>{user.userName}</h2>
          <p>{user.email}</p>
          <p>{user.userSlug}</p>
        </div>
      )}
      {/* {users.map((user) => (
        <div key={user.userId}>
          <h2>{user.userName}</h2>
          <p>{user.email}</p>
        </div>
      ))} */}
    </div>
  );
}
