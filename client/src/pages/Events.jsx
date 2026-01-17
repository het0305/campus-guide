import React, {useEffect, useState} from 'react'
import axios from 'axios'
import '../styles/events.css'

export default function Events(){
  const [events, setEvents] = useState([])
  const [form, setForm] = useState({title:'', date:'', location:'', description:''})

  useEffect(()=>{ axios.get('/api/events').then(r=>setEvents(r.data)).catch(()=>{}) },[])

  const submit = async (e) =>{
    e.preventDefault()
    await axios.post('/api/events', form)
    const {data} = await axios.get('/api/events')
    setEvents(data)
    setForm({title:'', date:'', location:'', description:''})
  }

  return (
    <div className="events">
      <h2>Events</h2>
      <ul>
        {events.map(ev=> (
          <li key={ev._id}>
            <h3>{ev.title}</h3>
            <p>{ev.description}</p>
            <p><strong>Date:</strong> {ev.date ? new Date(ev.date).toLocaleString() : 'TBD'}</p>
            <p><strong>Location:</strong> {ev.location}</p>
          </li>
        ))}
      </ul>

      <h3>Add Event</h3>
      <form onSubmit={submit} className="event-form">
        <input value={form.title} onChange={e=>setForm({...form, title:e.target.value})} placeholder="Title" required />
        <input value={form.date} onChange={e=>setForm({...form, date:e.target.value})} type="datetime-local" />
        <input value={form.location} onChange={e=>setForm({...form, location:e.target.value})} placeholder="Location" />
        <textarea value={form.description} onChange={e=>setForm({...form, description:e.target.value})} placeholder="Description" />
        <button type="submit">Add</button>
      </form>
    </div>
  )
}
