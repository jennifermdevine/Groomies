import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Modal from 'react-modal';
import TimePicker from 'react-time-picker';
import { supabase } from '../supabaseClient';
import '../App.css';
import { useUser } from './UserContext';

Modal.setAppElement('#root');

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTitle, setAppointmentTitle] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('10:00');
  const { user } = useUser();

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
