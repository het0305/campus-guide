import "../styles/home.css";

export default function Home() {
  const events = [];

  return (
    <div className="home">
      <h1>Welcome to Campus Guide</h1>

      <p>
        This site helps students and visitors find departments, events and the
        campus map.
      </p>

      <hr style={{ margin: "20px 0" }} />

      <h2>📢 Campus Notifications</h2>

      {events.length === 0 && (
        <p style={{ color: "#666" }}>No events yet.</p>
      )}

      {events.map((e) => (
        <div
          key={e.id}
          className="event-card"
        >
          <h4>{e.title}</h4>
          <small>📅 {e.date}</small>
          <p>{e.desc}</p>
        </div>
      ))}
    </div>
  );
}
