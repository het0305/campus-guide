import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/admin.css";
import { setAuth } from "../utils/auth";

export default function AdminLogin() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function login() {
    if (!user || !pass) return alert("Please enter username and password");
    setLoading(true);
    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user, password: pass }),
      });
      const data = await res.json();
      if (data && data.success) {
        if (data.token) {
          setAuth(data.token, data.role || "admin", data.name || "Admin");
        }
        nav("/admin");
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      alert("Login failed — check server is running");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-bg">
      <div className="admin-card">
        <h2>Admin Login</h2>
        <p>Campus Guide Control Panel</p>

        <input
          placeholder="Username"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />

        <button onClick={login} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}
