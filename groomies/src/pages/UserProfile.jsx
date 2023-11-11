import React, { useEffect, useReducer, useState } from 'react';
import { Helmet } from "react-helmet-async";
import Card from 'react-bootstrap/Card';
import { useUser } from '../components/UserContext';

// Reducer for managing the state
const reducer = (state, action) => {
  console.log("Reducer action received:", action);
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
  const [userImage, setUserImage] = useState();

  useEffect(() => {
    if (contextUser) {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        // If you have a specific logic to fetch the user image or additional data, apply it here
        const imageUrl = contextUser.userImage || 'default_profile_image.jpg';
        setUserImage(imageUrl);
        dispatch({ type: 'FETCH_SUCCESS', payload: contextUser });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: 'Failed to fetch user data' });
      }
    } else {
      dispatch({ type: 'FETCH_FAIL', payload: 'User not logged in' });
    }
  }, [contextUser]);

  return (
    <div>
      <Helmet>
      <title>{user?.userSlug ? `${user.userSlug}'s Profile` : 'User Profile'}</title>
      </Helmet>
      <h1 style={{color: 'rgb(17, 28, 52)', fontWeight: '800'}}>User Profile</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {user && (
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
