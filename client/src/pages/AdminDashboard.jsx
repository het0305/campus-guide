import React from 'react'
import NavBar from '../components/NavBar'
import Home from './Home'
import '../styles/admin.css'

export default function AdminDashboard(){
	return (
		<>
			<NavBar />
			<main style={{ padding: '1rem' }}>
				<Home />
			</main>
		</>
	)
}
