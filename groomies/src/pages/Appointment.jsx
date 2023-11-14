import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { getImageUrl } from './PetProfile';
import { Helmet } from "react-helmet-async";
import { Container, Row, Col, Card } from "react-bootstrap";
import "../components/AppointmentCSS.css";

export default function Appointment() {
    const { appointmentId } = useParams();
    const [appointment, setAppointment] = useState(null);
    const [pet, setPet] = useState(null);
    const [user, setUser] = useState(null);
    const [groomie, setGroomie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                <Col>
                    <Card.Body>
                {appointment && (
                    <div>
                        <h2>Title: {appointment.title}</h2>
                        <p>Appointment Time: {new Date(appointment.appointment).toLocaleString()}</p>
                    </div>
                )}
                </Card.Body>
                </Col>
                {user && (
                    <div>
                        <h3>User Details</h3>
                        <p>Name: {user.fullName}</p>
                        <p>Email: {user.email}</p>
                        <p>Username: {user.userName}</p>
                    </div>
                )}
                {groomie && (
                    <div>
                        <h3>Groomie Details</h3>
                        <p>Name: {groomie.groomieName}</p>
                        <p>Email: {groomie.email}</p>
                    </div>
                )}
                {pet && (
                    <div>
                        <h3>Pet Details</h3>
                        <p>Name: {pet.petName}</p>
                        <p>Species: {pet.species}</p>
                        {pet.imageUrl && (
                            <div>
                                <img src={pet.imageUrl} alt={pet.petName} style={{ width: '100px', height: '100px' }} />
                            </div>
                        )}
                    </div>
                )}
                </div>
            </Container>
        </div>
    );
}