import { useNavigate } from "react-router-dom";
import "../styles/roleselect.css";

export default function RoleSelect() {
  const nav = useNavigate();

  return (
    <div className="role-bg">

      <div className="role-card">

        <h1>Campus Guide</h1>
        <p>Select how you want to continue</p>

        <button className="visitor-btn" onClick={() => nav("/visitor")}>
          Continue as Visitor
        </button>

        <button className="admin-btn" onClick={() => nav("/admin-login")}>
          Admin Login
        </button>

      </div>

    </div>
  );
}
