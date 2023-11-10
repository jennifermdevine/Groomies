// UserProfile.jsx
import { useEffect, useReducer, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from "react-helmet-async";
import { fetchPetsWithImages, getImageUrl } from './PetProfile';
import { supabase } from '../supabaseClient';
import Card from 'react-bootstrap/Card';


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

const initialState = {
  user: {
    pets: [],
  },
  loading: false,
  error: '',
  isEditing: false,
};

export default function UserProfile() {
  const { userId } = useParams();
  const [userImage, setUserImage] = useState(null);

  const [{ user, loading, error }, dispatch] = useReducer(reducer, initialState);

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

      if (error) {
        console.error('Error fetching user:', error);
        dispatch({ type: 'FETCH_FAIL', payload: error.message });
        return;
      }

      if (data && data.length > 0) {
        const user = data[0];
        const petsArray = user.pets ? (Array.isArray(user.pets) ? user.pets : [user.pets]) : [];
        const petsWithImages = await fetchPetsWithImages(petsArray);
        // console.log('petsWithImages:', petsWithImages);
        dispatch({ type: 'FETCH_SUCCESS', payload: { ...user, pets: petsWithImages } });
      } else {
        dispatch({ type: 'FETCH_FAIL', payload: 'No user found' });
      }
    };

    fetchUsers();
  }, [userId]);

  useEffect(() => {
    const fetchUserImage = async () => {
      if (user?.userImage) {
        try {
          const url = await getImageUrl('users', user.userImage);
          setUserImage(url);
        } catch (error) {
          console.error('Error fetching user image:', error);
        }
      }
    };

    fetchUserImage();
  }, [user?.userImage]);

  return (
    <div>
      <Helmet>
        <title>{user.userSlug ? `${user.userSlug}'s Profile` : 'User Profile'}</title>
      </Helmet>
      <h1 style={{color: 'rgb(17, 28, 52)', fontWeight: '800'}}>User Profile</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {user.userName && (
        <div className="profWrapper">
        <Card>
        <Card.Title>{user.fullName}</Card.Title>
          <Card.Body>
          <Card.Img
            className="profImg"
            variant="top"
            src={userImage || 'default_profile_image.jpg'}
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
            <div>
            
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