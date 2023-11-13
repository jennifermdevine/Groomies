import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Modal from 'react-modal';
import TimePicker from 'react-time-picker';
import { supabase } from '../supabaseClient';
import '../App.css';
import './Calendar.css';
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet-async";

Modal.setAppElement('#root');

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTitle, setAppointmentTitle] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('10:00');
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState('');
  const [groomies, setGroomies] = useState([]);
  const [selectedGroomie, setSelectedGroomie] = useState('');
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    fetchAppointments();
    fetchGroomies();
    if (user?.userId) {
      fetchUserPets(user.userId);
    }
  }, [user]);

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

  const fetchAppointments = async () => {
    const { data, error } = await supabase
      .from('appointments')
      .select('appointmentId, title, appointment');

    if (error) {
      console.error('Error fetching appointments:', error);
    } else {
      const fetchedEvents = data.map(appt => ({
        id: appt.appointmentId, // Set the event ID to the appointmentId from your database
        title: appt.title,
        start: new Date(appt.appointment).toISOString(),
        allDay: false,
      }));
      setEvents(fetchedEvents);
    }
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
  }, []);

  const handleEventClick = ({ event }) => {
    if (user) {
      // Navigate to the Appointments page with the specific appointmentId
      navigate(`/appointment/${event.id}`); // Use the event.id which is the appointmentId
    }
  };

  return (
    <div className='body'>
      <Helmet>
        <title>Calendar</title>
      </Helmet>
      <div className="calendar-container">
        <div className="fc-button-group" style={{ textAlign: 'center', marginTop: '10px' }}>
          {user && (
            <button
              type="button"
              className="apptButton"
              onClick={() => setModalIsOpen(true)}
            >
              Make an Appointment
            </button>
          )}
        </div>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            start: 'prev,next today',
            center: 'title',
            end: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          titleFormat={{ year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }}
          events={events}
          slotMinTime="08:00:00"
          slotMaxTime="18:00:00"
          eventClick={handleEventClick}
        />
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
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
      </div>
    </div>
  );
}
