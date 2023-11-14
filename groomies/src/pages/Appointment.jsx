import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { getImageUrl } from './PetProfile';
import { Helmet } from "react-helmet-async";
import { Container, Row, Col, Card } from "react-bootstrap";
import "../components/AppointmentCSS.css";
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

export default function Appointment() {
    const { appointmentId } = useParams();
    const [appointment, setAppointment] = useState(null);
    const [pet, setPet] = useState(null);
    const [user, setUser] = useState(null);
    const [groomie, setGroomie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAppointmentDetails = async () => {
            try {
                // Fetch the appointment details
                const { data: appointmentData, error: appointmentError } = await supabase
                    .from('appointments')
                    .select('*')
                    .eq('appointmentId', appointmentId)
                    .single();

                if (appointmentError) throw appointmentError;
                setAppointment(appointmentData);

                // Fetch the pet details along with the image
                const { data: petData, error: petError } = await supabase
                    .from('pets')
                    .select('*')
                    .eq('petId', appointmentData.petId)
                    .single();

                if (petError) throw petError;
                if (petData.petImage) {
                    petData.imageUrl = await getImageUrl(petData.petImage);
                }
                setPet(petData);

                // Fetch the user details
                const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select('*')
                    .eq('userId', appointmentData.userId)
                    .single();

                if (userError) throw userError;
                setUser(userData);

                // Fetch the groomie details
                const { data: groomieData, error: groomieError } = await supabase
                    .from('groomies')
                    .select('groomieId, groomieName, email')
                    .eq('groomieId', appointmentData.groomieId)
                    .single();

                if (groomieError) throw groomieError;
                setGroomie(groomieData);
            } catch (error) {
                console.error('Error:', error);
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchAppointmentDetails();
    }, [appointmentId]);

    const cancelAppointment = async () => {
        if (window.confirm('Are you sure you want to cancel this appointment?')) {
            try {
                const { error } = await supabase
                    .from('appointments')
                    .delete()
                    .match({ appointmentId: appointment.appointmentId });

                if (error) {
                    throw error
                };
                navigate('/calendar');
            } catch (error) {
                console.error('Error deleting appointment:', error);
                setError('Failed to cancel appointment');
            }
        }
    }

    return (
        <div className="body">
            <Helmet>
                <title>{appointment?.title ? `${appointment.title}` : 'Appointment Details'}</title>
            </Helmet>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            <Container>
            <div>
                <h1>Appointment Details</h1>
                <hr/>
            </div>
            <div className="appt-container">
            <Col>
            <Card>
                {appointment && (
                    <Card.Text>
                    <div className="appt-time">
                        <h2 className="appt-titles">Title: {appointment.title}</h2>
                        <p>Appointment Time: {new Date(appointment.appointment).toLocaleString()}</p>
                        <hr/>
                    </div>
                    
                    </Card.Text>
                )}
            </Card>
            </Col>
            <Col>
            <Card>
                <div className="user-and-pet">
                {user && (
                    <Card.Text>
                    <div className="user-details">
                        <h3 className="appt-titles">Owner Details</h3>
                        <p>Name: {user.fullName}</p>
                        <p>Email: {user.email}</p>
                        <p>Username: {user.userName}</p>
                    </div>
                    </Card.Text>
                )}
                {pet && (
                    <Card.Text>
                    <div className="pet-details">
                        <h3 className="appt-titles">Pet Details</h3>
                        <p>Name: {pet.petName}</p>
                        <p>Species: {pet.species}</p>
                        {pet.imageUrl && (
                            <div>
                                <img src={pet.imageUrl} alt={pet.petName} style={{ width: '100px', height: '100px' }} />
                            </div>
                        )}
                    </div>
                    </Card.Text>
                )}
                </div>
            </Card>
            </Col>
            <Col>
            <Card>
                {groomie && (
                    <Card.Text>
                        <hr/>
                    <div className="groomie-details">
                        <h3 className="appt-titles">Groomie Details</h3>
                        <p>Name: {groomie.groomieName}</p>
                        <p>Email: {groomie.email}</p>
                        <hr/>
                    </div>
                    </Card.Text>
                )}
            </Card>
            </Col>
            <div>
            <br/>
                    <button className="logoutButton" onClick={cancelAppointment}>Cancel Appointment</button>
                </div>
                </div>
                </Container>
        </div>
        
    );
}