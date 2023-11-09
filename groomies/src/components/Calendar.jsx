import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Modal from 'react-modal';
import { supabase } from '../supabaseClient';
import '../App.css';

// Set up the root element for accessibility for Modal
Modal.setAppElement('#root');

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTitle, setAppointmentTitle] = useState('');

  // Fetch appointments from Supabase
  const fetchAppointments = async () => {
    const { data, error } = await supabase
      .from('appointments')
      .select('appointmentId, appointment');

    if (error) {
      console.error('Error fetching appointments:', error);
    } else {
      const fetchedEvents = data.map(appt => ({
        title: `Appointment #${appt.appointmentId}`,
        start: appt.appointment,
        allDay: true,
      }));
      setEvents(fetchedEvents);
    }
  };

  // Add a new appointment to Supabase
  const addAppointment = async (date, title) => {
    const { data, error } = await supabase
      .from('appointments')
      .insert([{ appointment: date, title }]);

    if (error) {
      console.error('Error adding new appointment:', error);
    } else {
      fetchAppointments();
      alert(`Appointment added with ID: ${data[0].appointmentId}`);
    }
  };

  // Function to handle modal form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    addAppointment(appointmentDate, appointmentTitle);
    setModalIsOpen(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          start: 'today prev,next',
          center: 'title',
          end: 'dayGridMonth,timeGridWeek,timeGridDay addEventButton',
        }}
        customButtons={{
          addEventButton: {
            text: 'Add Event',
            click: () => setModalIsOpen(true),
          },
        }}
        events={events}
      />
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Add Appointment"
        overlayClassName="react-modal-overlay"
        className="react-modal-content"
      >
        <h2>Add New Appointment</h2>
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
            <button type="submit">Add Appointment</button>
            <button type="button" onClick={() => setModalIsOpen(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
