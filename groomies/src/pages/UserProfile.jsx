// UserProfile.jsx
import React, { useEffect, useReducer, useState } from 'react';
import { Helmet } from "react-helmet-async";
import Card from 'react-bootstrap/Card';
import { useUser } from '../components/UserContext';
import { fetchPetsWithImages, getImageUrl } from './PetProfile';
import { supabase } from '../supabaseClient';

// Reducer for managing the state
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, user: action.payload, loading: false, error: '' };
    case 'FETCH_PETS_SUCCESS':
      return { ...state, user: { ...state.user, pets: action.payload }, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  loading: false,
  error: '',
};

export default function UserProfile() {
  const { user: contextUser } = useUser();
  const [{ user, loading, error }, dispatch] = useReducer(reducer, initialState);
  const [userImage, setUserImage] = useState();

  useEffect(() => {
    const fetchUserAndPets = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data, error } = await supabase
          .from('users')
          .select(`
            *,
            pets(petId, petName, petSlug, petImage, species)
          `)
          .eq('userId', contextUser?.userId);

        if (error) throw error;

        if (data && data.length > 0) {
          const userData = data[0];
          const imageUrl = await getImageUrl('users', userData.userImage) || 'default_profile_image.jpg';
          setUserImage(imageUrl);

          const petsWithImages = userData.pets ? await fetchPetsWithImages(userData.pets) : [];
          dispatch({ type: 'FETCH_SUCCESS', payload: { ...userData, pets: petsWithImages } });
        }
      } catch (error) {
        console.error('Error fetching user and pets:', error);
        dispatch({ type: 'FETCH_FAIL', payload: error.message });
      }
    };

    if (contextUser?.userId) {
      fetchUserAndPets();
    }
  }, [contextUser]);

  return (
    <div>
      <Helmet>
        <title>{user?.userSlug ? `${user.userSlug}'s Profile` : 'User Profile'}</title>
      </Helmet>
      <h1 style={{ color: 'rgb(17, 28, 52)', fontWeight: '800' }}>User Profile</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {user && (
        <div className="profile-container" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className="user-info" style={{ flex: 1 }}>
            <Card>
              <Card.Title>{user.fullName}</Card.Title>
              <Card.Body>
                <Card.Img
                  className="profImg"
                  variant="top"
                  src={userImage}
                  alt={`${user.userName}'s profile`}
                  style={{
                    height: '20vh',
                    width: 'calc(50vw / 3)',
                    objectFit: 'cover'
                  }}
                />
                <Card.Text>{user.email}</Card.Text>
                <Card.Text>Username: {user.userName}</Card.Text>
              </Card.Body>
            </Card>
          </div>
          <div className="pets-info" style={{ flex: 1 }}>
            {user.pets && user.pets.length > 0 ? (
              user.pets.map(pet => (
                <Card key={pet.petId} className="profCards">
                  <Card.Body>
                    <Card.Text>Name: {pet.petName}</Card.Text>
                    <Card.Text>Species: {pet.species}</Card.Text>
                    {pet.imageUrl && (
                      <Card.Img
                        className="profImg"
                        variant="bottom"
                        src={pet.imageUrl}
                        alt={`${pet.petName}`}
                        style={{
                          height: '20vh',
                          width: 'calc(50vw / 3)',
                          objectFit: 'cover'
                        }}
                      />
                    )}
                  </Card.Body>
                </Card>
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
