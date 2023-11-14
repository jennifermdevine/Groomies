// CalendarModal.jsx
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
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
        const { error } = await supabase
            .from('appointments')
            .insert([
                {
                    appointment: new Date(dateTime).toISOString(),
                    title,
                    userId,
                    petId,
                    groomieId
                }
            ]);

        if (error) {
            console.error('Error adding new appointment:', error);
        } else {
            fetchAppointments();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const dateTime = `${appointmentDate}T${appointmentTime}`;
        addAppointment(dateTime, appointmentTitle, user.userId, selectedPet, selectedGroomie);
        setModalIsOpen(false);
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
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={onClose}
            contentLabel="Add Appointment"
            overlayClassName="react-modal-overlay"
            className="react-modal-content"
        >
            <h2>Make a New Appointment</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Appointment Title:
                        <input
                            type="text"
                            value={appointmentTitle}
                            onChange={(e) => setAppointmentTitle(e.target.value)}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Appointment Date:
                        <input
                            type="date"
                            value={appointmentDate}
                            onChange={(e) => setAppointmentDate(e.target.value)}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Appointment Time:
                        <div className="custom-time-picker">
                            <TimePicker
                                onChange={setAppointmentTime}
                                value={appointmentTime}
                                format="HH:mm"
                                hourPlaceholder="hh"
                                minutePlaceholder="mm"
                                step={30}
                            />
                        </div>
                    </label>
                </div>
                <div>
                    <label>
                        Select Pet:
                        <select value={selectedPet} onChange={handlePetChange}>
                            {pets.map(pet => (
                                <option key={pet.petId} value={pet.petId}>{pet.petName}</option>
                            ))}
                        </select>
                    </label>
                </div>
                <div>
                    <label>
                        Select Groomie:
                        <select value={selectedGroomie} onChange={handleGroomieChange}>
                            <option value="">Select a Groomie</option>
                            {groomies.map(groomie => (
                                <option key={groomie.groomieId} value={groomie.groomieId}>
                                    {groomie.groomieName}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <button type="submit">Add Appointment</button>
                <button type="button" onClick={() => setModalIsOpen(false)}>Cancel</button>
            </form>
        </Modal>
    );
}
