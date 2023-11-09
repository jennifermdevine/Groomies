import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Modal from 'react-modal';
import TimePicker from 'react-time-picker';
import { supabase } from '../supabaseClient';
import '../App.css';

Modal.setAppElement('#root');

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTitle, setAppointmentTitle] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('10:00');

  const fetchAppointments = async () => {
    const { data, error } = await supabase
      .from('appointments')
      .select('title, appointment');

    if (error) {
      console.error('Error fetching appointments:', error);
    } else {
      const fetchedEvents = data.map(appt => ({
        title: appt.title,
        start: new Date(appt.appointment).toISOString(),
        allDay: false,
      }));
      setEvents(fetchedEvents);
    }
  };

  const addAppointment = async (dateTime, title) => {
    const { error } = await supabase
      .from('appointments')
      .insert([{ appointment: new Date(dateTime).toISOString(), title }]);

    if (error) {
      console.error('Error adding new appointment:', error);
    } else {
      fetchAppointments();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dateTime = `${appointmentDate}T${appointmentTime}`;
    addAppointment(dateTime, appointmentTitle);
    setModalIsOpen(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          start: 'today prev,next',
          center: 'title',
          end: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        events={events}
        slotMinTime="08:00:00"
        slotMaxTime="18:00:00"
      />
      <div className="fc-button-group" style={{ textAlign: 'center', marginTop: '10px' }}>
        <button
          type="button"
          className="fc-button fc-button-primary"
          onClick={() => setModalIsOpen(true)}
        >
          Add Event
        </button>
      </div>
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
            <button type="submit">Add Appointment</button>
            <button type="button" onClick={() => setModalIsOpen(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
