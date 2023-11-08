import { useEffect, useReducer, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Helmet } from "react-helmet-async";

// Function to retrieve the public URL of an image from Supabase storage
const getImageUrl = async (folder, path) => {
  const fullPath = `${folder}/${path}`;

  const response = await supabase.storage
    .from('Images')
    .getPublicUrl(fullPath);

  const { publicUrl, error } = response.data;

  if (error) {
    console.error("Error fetching image URL:", error);
    return null;
  }
  return publicUrl;
};

// Reducer function for useReducer hook to manage complex component state
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

// Initial state for the reducer, setting up default values
const initialState = {
  user: {
    pets: [],
  },
  loading: false,
  error: '',
  isEditing: false,
};

// The main component for the User Profile page
export default function UserProfile() {
  const { userId } = useParams();
  const [userImage, setUserImage] = useState(null);

  const [{ user, loading, error }, dispatch] = useReducer(reducer, initialState);

  // Fetch user and related pets when the component mounts or the userId changes
  useEffect(() => {
    const fetchUsers = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          pets!inner(petId, petName, petSlug, petImage, species )
        `)
        .eq('userId', userId);

      // Handle errors by dispatching a fetch fail action
      if (error) {
        console.error('Error fetching user:', error);
        dispatch({ type: 'FETCH_FAIL', payload: error.message });
        return;
      }

      // Process the fetched data and dispatch a fetch success action
      if (data && data.length > 0) {
        const user = data[0];

        const petsArray = user.pets ? (Array.isArray(user.pets) ? user.pets : [user.pets]) : [];

        // Fetch image URLs for each pet and update the pet objects with the image URLs
        const petsWithImages = await Promise.all(petsArray.map(async (pet) => {
          if (pet.petImage) {
            try {
              const url = await getImageUrl('pets', pet.petImage);
              return { ...pet, imageUrl: url };
            } catch (imgError) {
              console.error('Error fetching pet image:', imgError);
              return { ...pet, imageUrl: null };
            }
          }
          return pet;
        }));

        dispatch({ type: 'FETCH_SUCCESS', payload: { ...user, pets: petsWithImages } });
      } else {
        console.log(`No data returned from Supabase for userId: ${userId}`);
        dispatch({ type: 'FETCH_FAIL', payload: 'No user found' });
      }
    };
    fetchUsers();
  }, [userId]);

  // Fetch the user image when the user state updates and contains a user image path
  useEffect(() => {
    if (user?.userImage) {
      getImageUrl('users', user.userImage).then(url => {
        if (url) {
          setUserImage(url);
        }
      }).catch(error => {
        console.error('Error fetching user image:', error);
      });
    }
  }, [user]);

  return (
    <div>
      <Helmet>
        <title>{user.userSlug ? `${user.userSlug} | Profile` : 'User Profile'}</title>
      </Helmet>
      <h1>User Profile:</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {user.userName && (
        <div>
          <img
            src={userImage}
            alt={user.userImage}
            style={{
              height: '30vh',
              width: '50vw'
            }}
          />
          <h2>Name: {user.fullName}</h2>
          <p>Email: {user.email}</p>
          <p>UserName: {user.userName}</p>
          <div>
            <h3>Pets:</h3>
            {user.pets && user.pets.length > 0 ? (
              user.pets.map(pet => (
                <div key={pet.petId}>
                  <p>Name: {pet.petName}</p>
                  <p>Species: {pet.species}</p>
                  {pet.imageUrl && (
                    <img
                      src={pet.imageUrl}
                      alt={pet.petName}
                      style={{
                        height: '30vh',
                        width: '50vw'
                      }}
                    />
                  )}
                </div>
              ))
            ) : (
              <p>No pets found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
