// Calendar.jsx
import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { supabase } from '../supabaseClient';
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';
import CalendarModal from './CalendarModal';
import { Helmet } from "react-helmet-async";
import Modal from 'react-modal';
import '../App.css';
import './Calendar.css';

Modal.setAppElement('#root');

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    const { data, error } = await supabase
      .from('appointments')
      .select('appointmentId, title, appointment');

    if (error) {
      console.error('Error fetching appointments:', error);
    } else {
      const fetchedEvents = data.map(appt => ({
        id: appt.appointmentId,
        title: appt.title,
        start: new Date(appt.appointment).toISOString(),
        allDay: false,
      }));
      setEvents(fetchedEvents);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleEventClick = ({ event }) => {
    if (user) {
      navigate(`/appointment/${event.id}`);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    fetchAppointments();
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
        <CalendarModal
          isOpen={modalIsOpen}
          onClose={closeModal}
          fetchAppointments={fetchAppointments}
          user={user}
        />
      </div>
    </div>
  );
}
