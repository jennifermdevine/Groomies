// import React from 'react';
// import '@mobiscroll/react/dist/css/mobiscroll.min.css';
// import { Datepicker, Page, setOptions } from '@mobiscroll/react';

// setOptions({
//     theme: 'windows',
//     themeVariant: 'light'
// });

// export default function Calendar() {
//     const inputProps = {
//         placeholder: 'Please Select...'
//     };

//     const boxInputProps = {
//         label: 'Range',
//         labelStyle: 'stacked',
//         inputStyle: 'outline',
//         placeholder: 'Please Select...'
//     };

//     return (
//         <Page>
//             <Datepicker controls={['calendar']} inputComponent="input" inputProps={inputProps} />
//             <Datepicker controls={['calendar']} inputProps={boxInputProps} />
//             <Datepicker controls={['calendar']}  display="inline"/>
//         </Page>
//     );
// }

import React from "react";
import Fullcalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';


export default function Calendar() {
    return (
    <div>
        <Fullcalendar
        plugins={[dayGridPlugin,timeGridPlugin,interactionPlugin]}
        initialView ={"dayGridMonth"}
        headerToolbar= {{
            start: 'today prev,next',
            center: 'title,addEventButton',
            end:  'dayGridMonth, timeGridWeek, timeGridDay'
        }}
        customButtons= {{
            addEventButton: {
              text: 'add event...',
              click: function() {
                var dateStr = prompt('Enter a date in YYYY-MM-DD format');
                var date = new Date(dateStr + 'T00:00:00'); // will be in local time

                if (!isNaN(date.valueOf())) { // valid?
                  Fullcalendar.addEvent({
                    title: 'dynamic event',
                    start: date,
                    allDay: true
                  });
                  alert('Great. Now, update your database...');
                } else {
                  alert('Invalid date.');
                }
              }
            }
          }}
        />
    </div>
    );
}
