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
      console.log('userId before request:', userId); // Confirm userId is captured correctly from the route

      dispatch({ type: 'FETCH_REQUEST' });

      // Here we're about to make the request to Supabase, so we log the userId
      console.log('Making request to Supabase with userId:', userId);
      const { data, error } = await supabase
        .from('users')
        .select()
        .eq('userId', userId);
      
      console.log('Data received from Supabase:', data); // Log the raw data from the response
      if (error) {
        console.log('Supabase error:', error); // Log any error from Supabase
        dispatch({ type: 'FETCH_FAIL', payload: error.message })
      } else if (data && data.length > 0) {
        // We have data, so we'll dispatch the success action
        dispatch({ type: 'FETCH_SUCCESS', payload: data[0] }) // Assuming you're expecting to get one user back
      } else {
        // No data was returned for this userId
        console.log(`No data returned from Supabase for userId: ${userId}`);
        dispatch({ type: 'FETCH_FAIL', payload: 'No user found' })
      }
    };

    if (userId) {
      console.log('Fetching data for userId:', userId); // Confirming the fetch operation is initiated
      fetchUsers();
    } else {
      console.log('No userId provided'); // If userId is undefined or not provided
    }
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
