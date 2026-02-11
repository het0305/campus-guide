import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import Home from './Home'
import '../styles/admin.css'
import { getRole, getToken } from '../utils/auth'

export default function AdminDashboard(){
	const [contacts, setContacts] = useState([])
	const [loading, setLoading] = useState(true)
	const role = getRole()
	const token = getToken()
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'

	useEffect(()=>{
		if (role !== 'admin') return setLoading(false)
		setLoading(true)
		fetch(`${API_BASE}/contact`, {
			headers: {
				...(token ? { Authorization: `Bearer ${token}` } : {})
			}
		})
		.then(res=>res.json())
		.then(d=>setContacts(d || []))
		.catch(()=>setContacts([]))
		.finally(()=>setLoading(false))
	}, [role, token])

	return (
		<>
			<NavBar />
			<main style={{ padding: '1rem' }}>
				<Home />

				<section style={{ marginTop: 20 }}>
					<h2>Visitor Feedback</h2>
					{loading ? <p>Loading...</p> : (
						role === 'admin' ? (
							contacts.length ? (
								<div style={{ display: 'grid', gap: 12 }}>
									{contacts.map(c=> (
										<div key={c._id} style={{ padding:12, borderRadius:8, background:'#f3f4f6' }}>
											<strong>{c.name || 'Anonymous'}</strong> <span style={{ color:'#6b7280' }}>{c.email}</span>
											<p style={{ marginTop:8 }}>{c.message}</p>
											<small style={{ color:'#6b7280' }}>{new Date(c.createdAt).toLocaleString()}</small>
										</div>
									))}
								</div>
							) : <p>No feedback yet.</p>
						) : <p>Only admins can view visitor feedback.</p>
					)}
				</section>
			</main>
		</>
	)
}
