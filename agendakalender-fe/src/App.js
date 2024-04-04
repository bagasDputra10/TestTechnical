import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPencilAlt,
  faTrash,
  faFilePdf,
  faFileExcel,
} from "@fortawesome/free-solid-svg-icons";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./App.css";
import axios from "axios";

const App = () => {


    
    const [selectedDate, setSelectedDate] = useState(null);
    const [eventName, setEventName] = useState("");
    const [events, setEvents] = useState([]);
 
    const Date_Click_Fun = (date) => {
        setSelectedDate(date);
    };
 
    const Event_Data_Update = (event) => {
        setEventName(event.target.value);
    };

    const Create_Event_Fun = () => {
        if (selectedDate && eventName) {
            const day = ('0' + selectedDate.getDate()).slice(-2);
            const month = ('0' + (selectedDate.getMonth() + 1)).slice(-2);
            const year = selectedDate.getFullYear();
    
            const formattedDate = `${day}-${month}-${year}`;
    
            // Code from Kode 1
            const newEvent = {
                id: new Date().getTime(),
                date: selectedDate,
                title: eventName,
            };
    
            // Code from Kode 2
            const newFormattedEvent = {
                agendadate: formattedDate,
                title: eventName,
            };
    
            // Merge the creation of the event with Axios post request
            axios.post('http://localhost:3000/agenda', newFormattedEvent)
                .then(response => {
                    console.log('Event created successfully:', response.data);
    
                    // Add the event to the events list
                    setEvents([...events, newEvent]);
                    console.log(events);
    
                    // Clear the input fields and reset selected date
                    setSelectedDate(null);
                    setEventName("");
                })
                .catch(error => {
                    console.error('Error creating event:', error);
                });
        }
    };
    
  
 
    // const Update_Event_Fun = (eventId, newName) => {
    //     const updated_Events = events.map((event) => {
    //         if (event.id === eventId) {
    //             return {
    //                 ...event,
    //                 title: newName,
    //             };
    //         }
    //         return event;
    //     });
    //     setEvents(updated_Events);
    // };


    // Kode fungsi Update_Event_Fun
const Update_Event_Fun = (eventId, newTitle) => {

    axios.put(`http://localhost:3000/agenda/${eventId}`, { title: newTitle })
        .then(response => {
            console.log('Event updated successfully:', response.data);
            const updatedEvents = events.map(event => {
                if (event.id === eventId) {
                    return {
                        ...event,
                        title: newTitle
                    };
                }
                return event;
            });
            setEvents(updatedEvents);
        })
        .catch(error => {
            console.error('Error updating event:', error);
        });
};


 
    const Delete_Event_Fun = (eventId) => {
        const updated_Events = events.filter((event) => event.id !== eventId);
        setEvents(updated_Events);
    };

    const fetchEvents = (date) => {
        const day = ("0" + date.getDate()).slice(-2);
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();
    
        const formattedDate = `${year}-${month}-${day}`;
    
        axios
          .get(`http://localhost:3000/agenda?date=${formattedDate}`)
          .then((response) => {
            setEvents(response.data);
          })
          .catch((error) => {
            console.error("Error fetching events:", error);
          });
      };

  return (
    <div className="app">
      <h1> Aplikasi Agenda Kalender </h1>
      <div className="container">
        <div className="calendar-container">
          <Calendar
            value={selectedDate}
            onClickDay={Date_Click_Fun}
            tileClassName={({ date }) =>
              selectedDate &&
              date.toDateString() === selectedDate.toDateString()
                ? "selected"
                : events.some(
                    (event) =>
                      event.date.toDateString() === date.toDateString()
                  )
                ? "event-marked"
                : ""
            }
          />{" "}
        </div>
        <div className="event-container">
          {" "}
          {selectedDate && (
            <div className="event-form">
              <h2> Buat Kegiatan </h2>{" "}
              <p>
                {" "}
                Tanggal Dipilih: {selectedDate.toDateString()}{" "}
              </p>{" "}
              <input
                type="text"
                placeholder="Nama Agenda"
                value={eventName}
                onChange={Event_Data_Update}
              />{" "}
              <button className="create-btn" onClick={Create_Event_Fun}>
                <FontAwesomeIcon
                  icon={faPlus}
                  style={{ marginRight: "0.5rem" }}
                />
                Tambah Kegiatan{" "}
              </button>{" "}
            </div>
          )}
          {events.length > 0 && selectedDate && (
            <div className="event-list">
              <h2> Daftar Agenda </h2>{" "}
              <button className="pdf-btn">
                <FontAwesomeIcon
                  icon={faFilePdf}
                  style={{ marginRight: "0.5rem" }}
                />
                Report to PDF{" "}
              </button>{" "}
              <button className="excel-btn">
                <FontAwesomeIcon
                  icon={faFileExcel}
                  style={{ marginRight: "0.5rem" }}
                />
                Report to Excel{" "}
              </button>{" "}
              <div className="event-cards">
                {" "}
                {events.map((event) =>
                  event.date.toDateString() === selectedDate.toDateString() ? (
                    <div key={event.id} className="event-card">
                      <div className="event-card-header">
                        <div className="event-actions">
                          <button
                            className="update-btn"
                            onClick={() =>
                              Update_Event_Fun(
                                event.id,
                                prompt("Edit Agenda")
                              )
                            }
                          >
                            <FontAwesomeIcon
                              icon={faPencilAlt}
                              style={{ marginRight: "0.5rem" }}
                            />
                            Update Agenda{" "}
                          </button>{" "}
                          <button
                            className="delete-btn"
                            onClick={() => Delete_Event_Fun(event.id)}
                          >
                            <FontAwesomeIcon
                              icon={faTrash}
                              style={{ marginRight: "0.5rem" }}
                            />
                            Delete Agenda{" "}
                          </button>{" "}
                        </div>{" "}
                      </div>{" "}
                      <div className="event-card-body">
                        <p className="event-title"> {event.title} </p>{" "}
                      </div>{" "}
                    </div>
                  ) : null
                )}{" "}
              </div>{" "}
            </div>
          )}{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};

export default App;

