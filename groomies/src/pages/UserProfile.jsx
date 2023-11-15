import React, { useEffect, useReducer } from 'react';
import { Helmet } from "react-helmet-async";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Button } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../components/UserContext';
import { fetchPetsWithImages } from './PetProfile';
import { supabase } from '../supabaseClient';
import "../components/UserProfileCSS.css";

// Reducer for managing the state
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, user: action.payload.user, pets: action.payload.pets, appointments: action.payload.appointments, loading: false, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  pets: [],
  appointments: [],
  loading: false,
  error: '',
};

export default function UserProfile() {
  const { user: contextUser } = useUser();
  const [{ user, pets, appointments, loading, error }, dispatch] = useReducer(reducer, initialState);
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


  // Function to fetch user details, pets, and appointments
  const fetchUserDetails = async (userId) => {
    dispatch({ type: 'FETCH_REQUEST' });
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select(`*, pets(petId, petName, petSlug, petImage, species)`)
        .eq('userId', userId)
        .single();

      if (userError) throw userError;

      const petsWithImages = await fetchPetsWithImages(userData.pets);

      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*')
        .eq('userId', userId);

      if (appointmentsError) throw appointmentsError;

      dispatch({ type: 'FETCH_SUCCESS', payload: { user: userData, pets: petsWithImages, appointments: appointmentsData } });
    } catch (error) {
      console.error('Error fetching user details:', error);
      dispatch({ type: 'FETCH_FAIL', payload: error.message });
    }
  };

  useEffect(() => {
    if (contextUser?.userId) {
      fetchUserDetails(contextUser.userId);
    }
  }, [contextUser]);

  return (
    <div className="body">
      <Helmet>
        <title>{user?.userSlug ? `${user.fullName}'s Profile` : 'User Profile'}</title>
      </Helmet>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {user && (
        <Container>
          <div className="profile-container">
            {/* User info and pets section */}
            <div className="user-info">
              <Col>
                <Card>
                  <Card.Body>
                    <Card.Text className="titleName">{user.fullName}</Card.Text>
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
                    <br />
                    <br />
                    <Card.Text>{user.email}</Card.Text>
                    <Card.Text>Username: {user.userName}</Card.Text>
                    <Button variant="dark" onClick={() => handleEditProfileClick(user.userId)}>
                      Edit Profile
                    </Button>
                    <Button variant="success" onClick={() => handleAddPetClick()}>
                      Add Pet
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </div>
            <div className="pets-info" style={{ marginBottom: "20px" }}>
              {pets && pets.length > 0 ? (
                pets.map(pet => (
                  <Row key={pet.petId}>
                    <Col>
                      <Card>
                        <Card.Body>
                          <Card.Text>Name: {pet.petName}</Card.Text>
                          <Card.Text>Species: {pet.species}</Card.Text>
                          {pet.imageUrl && (
                            <Card.Img
                              className="profImg"
                              src={pet.imageUrl}
                              alt={`${pet.petName}`}
                              style={{ height: '20vh', width: 'calc(50vw / 3)', objectFit: 'cover' }}
                            />
                          )}
                          <br />
                          <br />
                          <Button
                            variant="dark"
                            onClick={() => handleEditPetClick(pet.petId)}
                          >
                            Edit Pet
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                ))
              ) : (
                <p>No pets found.</p>
              )}
            </div>

            {/* Appointments section */}
            <div className="appointments-info">
              <h2>Appointments</h2>
              <hr/>
              {appointments && appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <Row key={appointment.appointmentId}>
                    <Col>
                      <Card>
                        <Card.Body>
                          <Link to={`/appointment/${appointment.appointmentId}`}>
                            <Card.Title>
                              {appointment.title}
                            </Card.Title>
                            <Card.Text>
                              Time: {new Date(appointment.appointment).toLocaleString()}
                            </Card.Text>
                          </Link>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                ))
              ) : (
                <p>No appointments found.</p>
              )}
              <div className="fc-button-group" style={{ textAlign: 'center', marginTop: '10px' }}>
              {user && (
            <Link to={`/calendar`}><button
              type="button"
              className="apptButton"
            >
              Make an Appointment
            </button>
            </Link>
          )}
        </div>
            </div>
          </div>
        </Container>
      )}
    </div>
  );
}