import { useState } from "react";

export default function CreateEvent() {
  const addEvent = () => {
    console.warn("Event context removed");
  };

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [desc, setDesc] = useState("");

  const handleSubmit = () => {
    if (!title || !date) return alert("Fill all fields");

    addEvent({
      id: Date.now(),
      title,
      date,
      desc,
    });

    alert("Event Published ✅");
    setTitle("");
    setDate("");
    setDesc("");
  };

  return (
    <div>
      <h2>📢 Create Event</h2>

      <input
        placeholder="Event Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br /><br />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <br /><br />

      <textarea
        placeholder="Description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />

      <br /><br />

      <button onClick={handleSubmit}>Publish Event</button>
    </div>
  );
}

