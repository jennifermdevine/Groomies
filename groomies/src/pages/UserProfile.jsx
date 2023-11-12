import React, { useEffect, useReducer } from 'react';
import { Helmet } from "react-helmet-async";
import Card from 'react-bootstrap/Card';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../components/UserContext';
import { fetchPetsWithImages } from './PetProfile';
import { supabase } from '../supabaseClient';

// Reducer for managing the state
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, user: action.payload, loading: false, error: '' };
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
  const userImageUrl = "https://hkyyizxvogotpfozdbdg.supabase.co/storage/v1/object/public/Images/users/";
  const navigate = useNavigate();

  const handleEditPetClick = (petId) => {
    navigate(`/EditPet/${petId}`);
  };

  const handleEditProfileClick = (userId) => {
    navigate(`/EditProfile`)
  }

  const handleAddPetClick = () => {
    navigate(`/AddPet`)
  }


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
          const petsWithImages = await fetchPetsWithImages(userData.pets);
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
        <title>{user?.userSlug ? `${user.fullName}'s Profile` : 'User Profile'}</title>
      </Helmet>
      <h1 className="pageTitle">User Profile</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {user && (
        <div className="profile-container" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className="user-info" style={{ flex: 1 }}>
            <Card>
              <Card.Text>{user.fullName}</Card.Text>
              <Card.Body>
                <Card.Img
                  className="profImg"
                  src={user.userImage ? `${userImageUrl}${user.userImage}` : 'default_profile_image.jpg'}
                  alt={`${user.userName}'s profile`}
                  style={{
                    height: '20vh',
                    width: 'calc(50vw / 3)',
                    objectFit: 'cover'
                  }}
                />
                <br/>
                <br/>
                <Card.Text>{user.email}</Card.Text>
                <Card.Text>Username: {user.userName}</Card.Text>
                <Button variant="dark"
                        onClick={() => handleEditProfileClick(user.userId)}>
                            Edit Profile
                    </Button>
                <Button variant="success"
                        onClick={() => handleAddPetClick()}>
                          Add Pet
                        </Button>
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
                        src={pet.imageUrl}  // Use the URL directly from fetchPetsWithImages
                        alt={`${pet.petName}`}
                        style={{ height: '20vh', width: 'calc(50vw / 3)', objectFit: 'cover' }}
                      />
                    )}
                    <br/>
                    <br/>
                    <Button
                      variant="dark"
                      onClick={() => handleEditPetClick(pet.petId)}
                    >
                      Edit Pet
                    </Button>
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
