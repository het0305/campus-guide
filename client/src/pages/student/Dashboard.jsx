import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { getToken } from '../../utils/auth'
import '../../styles/departments.css'

export default function StudentDashboard(){
  const [msg,setMsg] = useState('')
  useEffect(()=>{
    axios.get('/api/student/dashboard', { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r=>setMsg(r.data.msg)).catch(()=>setMsg('Unable to load'))
  },[])
  return (
    <div className="departments">
      <h2>Student Dashboard</h2>
      <p>{msg}</p>
    </div>
  )
}
