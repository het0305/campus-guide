import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/admin.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    if (!name || !email || !password || !role) {
      return alert("Please fill all fields");
    }
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 201 && data && data.ok) {
        alert("Registered successfully. You can now log in.");
        nav("/admin-login");
      } else if (res.status === 400 && data && data.error) {
        alert(data.error);
      } else {
        alert("Registration failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Registration failed — check server is running");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-bg">
      <div className="admin-card">
        <h2>User Registration</h2>
        <p>Create a new campus account</p>

        <form onSubmit={handleRegister}>
          <input
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="student">Student</option>
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

