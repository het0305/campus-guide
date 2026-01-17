import { useState } from "react";

const timeSlots = [
  "08:30 - 09:30",
  "09:30 - 10:30",
  "Tea Break (10:30 - 10:45)",
  "10:45 - 11:45",
  "11:45 - 12:45",
  "Lunch Break (12:45 - 01:30)",
  "01:30 - 02:30",
  "02:30 - 03:30",
];

// ---------------- STUDENT TIMETABLE ----------------
const myTimetable = {
  Monday: ["Skill Dev", "Skill Dev", "BREAK", "AMAD", "SE", "BREAK", "MI", "—"],
  Tuesday: ["AMAD", "SE", "BREAK", "BT", "IPR", "BREAK", "IOT", "—"],
  Wednesday: ["Skill Dev", "MI", "BREAK", "BT Lab", "—", "BREAK", "Project", "IPR"],
  Thursday: ["MI", "MI", "BREAK", "IPR", "SE", "BREAK", "Skill Dev", "Project"],
  Friday: ["AMAD Lab", "—", "BREAK", "SE Lab", "—", "BREAK", "Skill Dev", "AMAD"],
};

// ---------------- STAFF DATA ----------------
const staffList = [
  {
    id: 1,
    name: "Dr. Rachna Patel",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    timetable: {
      Monday: ["MI", "—", "BREAK", "—", "MI", "BREAK", "—", "—"],
      Tuesday: ["—", "MI", "BREAK", "—", "—", "BREAK", "MI", "—"],
      Wednesday: ["MI", "—", "BREAK", "MI", "—", "BREAK", "—", "—"],
      Thursday: ["—", "MI", "BREAK", "—", "MI", "BREAK", "—", "—"],
      Friday: ["MI", "—", "BREAK", "—", "—", "BREAK", "MI", "—"],
    },
  },
  {
    id: 2,
    name: "Mr. Nikhil Gajbiye",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    timetable: {
      Monday: ["BT", "—", "BREAK", "BT Lab", "—", "BREAK", "—", "—"],
      Tuesday: ["—", "BT", "BREAK", "—", "BT Lab", "BREAK", "—", "—"],
      Wednesday: ["BT", "—", "BREAK", "—", "—", "BREAK", "BT Lab", "—"],
      Thursday: ["—", "BT", "BREAK", "—", "—", "BREAK", "—", "—"],
      Friday: ["BT Lab", "—", "BREAK", "BT", "—", "BREAK", "—", "—"],
    },
  },
  {
    id: 3,
    name: "Ms. Grishma Thakar",
    photo: "https://randomuser.me/api/portraits/women/68.jpg",
    timetable: {
      Monday: ["IPR", "—", "BREAK", "IPR", "—", "BREAK", "—", "—"],
      Tuesday: ["—", "IPR", "BREAK", "—", "IPR", "BREAK", "—", "—"],
      Wednesday: ["IPR", "—", "BREAK", "IPR", "—", "BREAK", "—", "—"],
      Thursday: ["—", "IPR", "BREAK", "—", "—", "BREAK", "—", "—"],
      Friday: ["—", "—", "BREAK", "IPR", "—", "BREAK", "IPR", "—"],
    },
  },
];

export default function Timetable() {
  const [activeTab, setActiveTab] = useState("student");
  const [selectedStaff, setSelectedStaff] = useState(null);

  return (
    <div style={{ padding: 20 }}>
      <h2>📅 Timetables</h2>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <button onClick={() => setActiveTab("student")}>
          My Timetable
        </button>
        <button onClick={() => setActiveTab("staff")}>
          Staff Timetable
        </button>
      </div>

      {/* STUDENT TIMETABLE */}
      {activeTab === "student" && (
        <>
          <h3>My Weekly Schedule</h3>
          <Table data={myTimetable} />
        </>
      )}

      {/* STAFF TIMETABLE */}
      {activeTab === "staff" && (
        <>
          {!selectedStaff ? (
            <>
              <h3>Select Staff</h3>

              <div style={{ display: "flex", gap: 20 }}>
                {staffList.map((staff) => (
                  <div
                    key={staff.id}
                    onClick={() => setSelectedStaff(staff)}
                    style={{
                      cursor: "pointer",
                      textAlign: "center",
                    }}
                  >
                    <img
                      src={staff.photo}
                      width="100"
                      height="100"
                      style={{ borderRadius: "50%" }}
                    />
                    <p>{staff.name}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <button onClick={() => setSelectedStaff(null)}>
                ⬅ Back
              </button>

              <h3>{selectedStaff.name} Timetable</h3>
              <Table data={selectedStaff.timetable} />
            </>
          )}
        </>
      )}
    </div>
  );
}

// ---------------- TABLE COMPONENT ----------------
function Table({ data }) {
  const days = Object.keys(data);
  const totalColumns = days.length + 1;

  return (
    <table
      border="1"
      cellPadding="8"
      style={{
        width: "100%",
        borderCollapse: "collapse",
        marginTop: 10,
      }}
    >
      <thead>
        <tr style={{ background: "#e5e7eb" }}>
          <th>Time</th>
          {days.map((day) => (
            <th key={day}>{day}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {timeSlots.map((time, index) => {
          const isBreak = time.toLowerCase().includes("break");

          // ✅ BREAK ROW (MERGED)
          if (isBreak) {
            return (
              <tr key={time}>
                <td
                  colSpan={totalColumns}
                  style={{
                    background: "#fde68a",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  ⏸ {time}
                </td>
              </tr>
            );
          }

          // ✅ NORMAL ROW
          return (
            <tr key={time}>
              <td style={{ fontWeight: "bold" }}>{time}</td>

              {days.map((day) => (
                <td
                  key={day + index}
                  style={{ textAlign: "center" }}
                >
                  {data[day][index]}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
