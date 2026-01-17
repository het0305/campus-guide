import React, {useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../styles/contact.css'
import { setAuth } from '../utils/auth'

export default function Login(){
  const [form,setForm] = useState({email:'', password:''})
  const [err,setErr] = useState('')
  const nav = useNavigate()
  const submit = async e =>{
    e.preventDefault()
    try{
      const res = await axios.post('/api/auth/login', form)
      setAuth(res.data.token, res.data.role, res.data.name)
      if (res.data.role === 'student') nav('/student')
      else nav('/staff')
    }catch(er){ setErr('Invalid credentials') }
  }
  return (
    <div className="contact">
      <h2>Login</h2>
      {err && <div className="notice">{err}</div>}
      <form onSubmit={submit} className="contact-form">
        <input required value={form.email} onChange={e=>setForm({...form, email:e.target.value})} placeholder="Email" />
        <input required value={form.password} onChange={e=>setForm({...form, password:e.target.value})} placeholder="Password" type="password" />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}
