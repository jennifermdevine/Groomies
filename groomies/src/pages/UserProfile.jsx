import { useEffect, useReducer, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Helmet } from "react-helmet-async";


const getImageUrl = async (path) => {
  const response = await supabase.storage
    .from('User_Images')
    .getPublicUrl(path);

  const { publicUrl, error } = response.data;

  if (error) {
    // console.error("Error fetching image URL:", error);
    return null;
  }
  return publicUrl;
};

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
  const [imageUrl, setImageUrl] = useState(null);

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

  useEffect(() => {
    if (user && user.userImage) {
      // fetch image URL and set the state
      getImageUrl(user.userImage).then(url => {
        // console.log("Image URL:", url);
        setImageUrl(url);
      });
    }
  }, [user]);

  return (
    <div>
      <h1>User Profile:</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {user.userName && (
        <div>
          <Helmet>
            <title>{user.userSlug} | Profile</title>
          </Helmet>
          <img
            src={imageUrl}
            alt={user.userImage}
          />
          <h2>Name: {user.fullName}</h2>
          <p>Email: {user.email}</p>
          <p>UserName: {user.userName}</p>
          <p>Pets: {user.pets}</p>
        </div>
      )}
    </div>
  );
}
