// CalendarModal.jsx
import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import TimePicker from 'react-time-picker';
import { supabase } from '../supabaseClient';

export default function CalendarModal({ isOpen, onClose, onEventAdded, user, fetchAppointments }) {
    const [appointmentDate, setAppointmentDate] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('10:00');
    const [appointmentTitle, setAppointmentTitle] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(isOpen);
    const [groomies, setGroomies] = useState([]);
    const [selectedGroomie, setSelectedGroomie] = useState('');
    const [pets, setPets] = useState([]);
    const [selectedPet, setSelectedPet] = useState('');

    const fetchGroomies = async () => {
        try {
            const { data, error } = await supabase
                .from('groomies')
                .select('groomieId, groomieName');

            if (error) {
                console.error('Error fetching groomies:', error);
            } else {
                setGroomies(data);
            }
        } catch (error) {
            console.error('Error fetching groomies:', error);
        }
    };

    const handleGroomieChange = (e) => {
        setSelectedGroomie(e.target.value);
    };

    const fetchUserPets = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('pets')
                .select('petId, petName')
                .eq('userId', userId);

            if (error) {
                console.error('Error fetching pets:', error);
            } else {
                setPets(data);
            }
        } catch (error) {
            console.error('Error fetching pets:', error);
        }
    };

    const handlePetChange = (e) => {
        setSelectedPet(e.target.value);
    };

    const addAppointment = async (dateTime, title, userId, petId, groomieId) => {
        const parsedPetId = parseInt(petId, 10);
        const parsedGroomieId = parseInt(groomieId, 10);

        if (isNaN(parsedPetId) || isNaN(parsedGroomieId) || isNaN(userId)) {
            console.error("Invalid petId, groomieId, or userId");
            return;
        }

        try {
            const { error } = await supabase
                .from('appointments')
                .insert([{
                    appointment: new Date(dateTime).toISOString(),
                    title,
                    userId,
                    petId: parsedPetId,
                    groomieId: parsedGroomieId
                }]);

            if (error) {
                console.error('Error adding new appointment:', error);
            } else {
                fetchAppointments();
            }
        } catch (error) {
            console.error('Error in addAppointment:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dateTime = `${appointmentDate}T${appointmentTime}`;
        await addAppointment(dateTime, appointmentTitle, user.userId, selectedPet, selectedGroomie);

        setAppointmentDate('');
        setAppointmentTime('10:00');
        setAppointmentTitle('');
        setSelectedPet('');
        setSelectedGroomie('');

        onClose();
    };

    useEffect(() => {
        fetchAppointments();
        fetchGroomies();
        if (user?.userId) {
            fetchUserPets(user.userId);
        }
    }, [user]);

    useEffect(() => {
        setModalIsOpen(isOpen);
    }, [isOpen]);

    return (
        <Modal show={modalIsOpen} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Make a New Appointment</Modal.Title>
            </Modal.Header>

            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Appointment Title:</Form.Label>
                        <Form.Control
                            type="text"
                            value={appointmentTitle}
                            onChange={(e) => setAppointmentTitle(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Appointment Date:</Form.Label>
                        <Form.Control
                            type="date"
                            value={appointmentDate}
                            onChange={(e) => setAppointmentDate(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Appointment Time:</Form.Label>
                        <TimePicker
                            onChange={setAppointmentTime}
                            value={appointmentTime}
                            format="HH:mm"
                            hourPlaceholder="hh"
                            minutePlaceholder="mm"
                            step={30}
                            className="form-control"
                            required
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Select Pet:</Form.Label>
                        <Form.Control as="select" value={selectedPet} onChange={handlePetChange} required>
                            <option value="">Select a Pet</option>
                            {pets.map(pet => (
                                <option key={pet.petId} value={pet.petId}>{pet.petName}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Select Groomie:</Form.Label>
                        <Form.Control as="select" value={selectedGroomie} onChange={handleGroomieChange} required>
                            <option value="">Select a Groomie</option>
                            {groomies.map(groomie => (
                                <option key={groomie.groomieId} value={groomie.groomieId}>{groomie.groomieName}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button variant="primary" type="submit">Add Appointment</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}