import React, { useState, useEffect } from "react";
import "../styles/Timetable.css";
import axios from "axios";
import { getRole, getToken } from "../utils/auth";

// ---------------- TIME SLOTS ----------------
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

// ---------------- STUDENT TIMETABLE DATA ----------------
const initialStudentTimetables = {
  sem2: {
    label: "2nd Semester",
    image: "/images/sem2.jpg",   // you can replace
    data: {
      Monday: ["Maths", "Physics", "BREAK", "Chemistry", "Lab", "BREAK", "English", "—"],
      Tuesday: ["English", "Maths", "BREAK", "Physics", "Lab", "BREAK", "Sports", "—"],
      Wednesday: ["Chemistry", "Physics", "BREAK", "Maths", "—", "BREAK", "Library", "—"],
      Thursday: ["Physics", "Chemistry", "BREAK", "Maths", "English", "BREAK", "Sports", "—"],
      Friday: ["Lab", "—", "BREAK", "English", "—", "BREAK", "Library", "—"],
    },
  },

  sem4: {
    label: "4th Semester",
    image: "/images/sem4.jpg",
    data: {
      Monday: [".NET", "OS", "BREAK", "PWJ", "PWJ", "BREAK", "AWD", "ICC"],
      Tuesday: ["Skill Dev", ".NET", "BREAK", "Skill Dev", "ICC", "BREAK", ".NET Lab", "—"],
      Wednesday: ["AWD Lab", "AWD Lab", "BREAK", "Skill Dev", "ICC", "BREAK", "Project", "Project"],
      Thursday: [".NET", "OS", "BREAK", "ICC Lab", "ICC Lab", "BREAK", "PWJ Lab", "PWJ Lab"],
      Friday: ["OS", "AWD", "BREAK", "PWJ", "AWD", "BREAK", "DVT Lab", "—"],
    },
  },

  sem6: {
    label: "6th Semester",
    image: "/images/sem6.jpg",
    data: {
      Monday: ["Skill Dev", "Skill Dev", "BREAK", "AMAD", "SE", "BREAK", "MI", "—"],
      Tuesday: ["AMAD", "SE", "BREAK", "BT", "IPR", "BREAK", "IOT", "—"],
      Wednesday: ["Skill Dev", "MI", "BREAK", "BT Lab", "—", "BREAK", "Project", "IPR"],
      Thursday: ["MI", "MI", "BREAK", "IPR", "SE", "BREAK", "Skill Dev", "Project"],
      Friday: ["AMAD Lab", "—", "BREAK", "SE Lab", "—", "BREAK", "Skill Dev", "AMAD"],
    },
  },
};

// ---------------- STAFF DATA (UNCHANGED) ----------------
const initialStaffList = [
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
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [studentTimetables, setStudentTimetables] = useState(initialStudentTimetables);
  const [staffList, setStaffList] = useState(initialStaffList);
  const role = getRole();
  const token = getToken();
  // Use /api so Vite proxy works (visitor requests succeed); override with VITE_API_BASE if set
  const API_BASE = import.meta.env.VITE_API_BASE || "/api";

  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  // Load timetables from server so visitor sees same data as admin; refetch when page is focused
  const fetchTimetables = React.useCallback(async () => {
    try {
      const stu = await axios.get(`${API_BASE}/timetable/student`, { headers });
      if (Array.isArray(stu.data) && stu.data.length > 0) {
        const mapped = {};
        stu.data.forEach((doc) => {
          const serverData = doc.data || {};
          if (serverData && typeof serverData === "object" && Object.keys(serverData).length > 0) {
            mapped[doc.semKey] = {
              label: doc.label || doc.semKey,
              image: doc.image || "",
              data: serverData
            };
          }
        });
        if (Object.keys(mapped).length > 0) {
          setStudentTimetables((s) => ({ ...s, ...mapped }));
        }
      }
    } catch (e) {
      console.warn("Timetable student fetch failed:", e?.message || e);
    }
    try {
      const staffRes = await axios.get(`${API_BASE}/timetable/staff`, { headers });
      if (Array.isArray(staffRes.data) && staffRes.data.length > 0) {
        const mapped = staffRes.data
          .map((doc) => {
            const tt = doc.timetable || {};
            if (!tt || typeof tt !== "object" || Object.keys(tt).length === 0) return null;
            return {
              id: doc.staffId,
              name: doc.name || `Staff ${doc.staffId}`,
              photo: doc.photo || "https://via.placeholder.com/80",
              timetable: tt
            };
          })
          .filter(Boolean);
        if (mapped.length > 0) {
          setStaffList((prev) => {
            const byId = Object.fromEntries(prev.map((p) => [p.id, p]));
            mapped.forEach((m) => {
              byId[m.id] = { ...(byId[m.id] || {}), ...m };
            });
            return Object.values(byId);
          });
        }
      }
    } catch (e) {
      console.warn("Timetable staff fetch failed:", e?.message || e);
    }
  }, [API_BASE, token]);

  useEffect(() => {
    fetchTimetables();
  }, [fetchTimetables]);

  const updateStudentSlot = async (semKey, day, index, value) => {
    if (role !== "admin") return alert("Only admins can edit timetables");
    let fullDataAfter;
    setStudentTimetables((s) => {
      const copy = { ...s };
      copy[semKey] = { ...copy[semKey], data: { ...copy[semKey].data } };
      copy[semKey].data[day] = [...(copy[semKey].data[day] || [])];
      while (copy[semKey].data[day].length <= index) copy[semKey].data[day].push("—");
      copy[semKey].data[day][index] = value;
      fullDataAfter = copy[semKey].data;
      return copy;
    });
    try {
      await axios.put(`${API_BASE}/timetable/student/${semKey}`, { day, index, value, fullData: fullDataAfter }, { headers });
    } catch (err) {
      console.warn("Timetable save failed:", err?.message || err);
    }
  };

  const updateStaffSlot = async (staffId, day, index, value) => {
    if (role !== "admin") return alert("Only admins can edit timetables");
    let fullTimetableAfter;
    setStaffList((s) => {
      return s.map((st) => {
        if (st.id !== staffId) return st;
        const copy = { ...st, timetable: { ...st.timetable } };
        copy.timetable[day] = [...(copy.timetable[day] || [])];
        while (copy.timetable[day].length <= index) copy.timetable[day].push("—");
        copy.timetable[day][index] = value;
        fullTimetableAfter = copy.timetable;
        return copy;
      });
    });
    try {
      await axios.put(`${API_BASE}/timetable/staff/${staffId}`, { day, index, value, fullData: fullTimetableAfter }, { headers });
    } catch (err) {
      console.warn("Timetable save failed:", err?.message || err);
    }
  };

  const deleteStaff = async (staffId) => {
    if (role !== "admin") return alert("Only admins can delete staff timetables");
    if (!confirm("Delete this staff timetable?")) return;
    setStaffList((s) => s.filter((st) => st.id !== staffId));
    try {
      await axios.delete(`${API_BASE}/timetable/staff/${staffId}`, { headers });
    } catch (err) {}
  };

  return (
    <div className="page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
        <h2>📅 Timetable Portal</h2>
        <button type="button" className="back-btn" onClick={fetchTimetables} style={{ marginBottom: 0 }}>
          🔄 Refresh timetable
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === "student" ? "active" : ""}
          onClick={() => {
            setActiveTab("student");
            setSelectedStaff(null);
          }}
        >
          🎓 Student Timetable
        </button>

        <button
          className={activeTab === "staff" ? "active" : ""}
          onClick={() => {
            setActiveTab("staff");
            setSelectedSemester(null);
          }}
        >
          👨‍🏫 Staff Timetable
        </button>
      </div>

      {/* ---------------- STUDENT SECTION ---------------- */}
      {activeTab === "student" && (
        <>
          {!selectedSemester ? (
            <div className="card-grid">
              {Object.entries(studentTimetables).map(([key, sem]) => (
                <div
                  key={key}
                  className="card"
                  onClick={() => setSelectedSemester(key)}
                >
                  <img src={sem.image} alt={sem.label} />
                  <h4>{sem.label}</h4>
                  <p>View Timetable →</p>
                </div>
              ))}
            </div>
          ) : (
            <>
              <button
                className="back-btn"
                onClick={() => setSelectedSemester(null)}
              >
                ⬅ Back
              </button>

              {(() => {
                const sem = studentTimetables[selectedSemester];
                return (
                  <>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <h3>{sem.label} Timetable</h3>
                        {role === 'admin' && (
                          <div>
                            <button onClick={async ()=>{
                              if(!confirm('Delete this semester timetable?')) return;
                              setStudentTimetables(s=>{ const copy = {...s}; delete copy[selectedSemester]; return copy; });
                              try{ await axios.delete(`${API_BASE}/timetable/student/${selectedSemester}`, { headers }); }catch(e){}
                            }}>Delete Timetable</button>
                            <button style={{marginLeft:8}} onClick={async ()=>{
                              try{
                                await axios.post(`${API_BASE}/timetable/student/${selectedSemester}/publish`, {}, { headers });
                                // refresh server data (only merge non-empty server timetables)
                                const stu = await axios.get(`${API_BASE}/timetable/student`, { headers });
                                if (Array.isArray(stu.data)){
                                  const mapped = {};
                                  stu.data.forEach((doc) => {
                                    const serverData = doc.data || {};
                                    if (Object.keys(serverData).length > 0) {
                                      mapped[doc.semKey] = {
                                        label: doc.label || doc.semKey,
                                        image: doc.image || "",
                                        data: serverData
                                      };
                                    }
                                  });
                                  if (Object.keys(mapped).length > 0) setStudentTimetables((s) => ({ ...s, ...mapped }));
                                }
                                alert('Published successfully');
                              }catch(e){ alert('Publish failed'); }
                            }}>Publish</button>
                          </div>
                        )}
                    </div>
                    <Table data={sem.data} semKey={selectedSemester} onEdit={updateStudentSlot} isAdmin={role === 'admin'} />
                  </>
                );
              })()}
            </>
          )}
        </>
      )}

      {/* ---------------- STAFF SECTION (UNCHANGED LOGIC) ---------------- */}
      {activeTab === "staff" && (
        <>
          {!selectedStaff ? (
            <div className="card-grid">
              {staffList.map((staff) => (
                <div
                  key={staff.id}
                  className="card"
                  onClick={() => setSelectedStaff(staff)}
                >
                  <img src={staff.photo} alt={staff.name} />
                  <h4>{staff.name}</h4>
                  <p>View Timetable →</p>
                </div>
              ))}
            </div>
          ) : (
            <>
              <button
                className="back-btn"
                onClick={() => setSelectedStaff(null)}
              >
                ⬅ Back
              </button>

              <h3>{selectedStaff.name} Timetable</h3>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div></div>
                {role === 'admin' && <div>
                  <button onClick={()=> deleteStaff(selectedStaff.id)} style={{marginLeft:8}}>Delete Timetable</button>
                  <button onClick={async ()=>{
                    try{
                      await axios.post(`${API_BASE}/timetable/staff/${selectedStaff.id}/publish`, {}, { headers });
                      // refresh staff list
                      const staffRes = await axios.get(`${API_BASE}/timetable/staff`, { headers });
                      if (Array.isArray(staffRes.data)){
                        const mapped = staffRes.data
                          .map((doc) => {
                            const tt = doc.timetable || {};
                            if (Object.keys(tt).length === 0) return null;
                            return {
                              id: doc.staffId,
                              name: doc.name || `Staff ${doc.staffId}`,
                              photo: doc.photo || "https://via.placeholder.com/80",
                              timetable: tt
                            };
                          })
                          .filter(Boolean);
                        if (mapped.length > 0) {
                          // merge by id, prefer server timetable
                          setStaffList((prev) => {
                            const byId = Object.fromEntries(prev.map((p) => [p.id, p]));
                            mapped.forEach((m) => {
                              byId[m.id] = { ...(byId[m.id] || {}), ...m };
                            });
                            return Object.values(byId);
                          });
                        }
                      }
                      alert('Published successfully');
                    }catch(e){ alert('Publish failed'); }
                  }} style={{marginLeft:8}}>Publish</button>
                </div>}
              </div>
              <Table data={selectedStaff.timetable} staffId={selectedStaff.id} onEdit={updateStaffSlot} isAdmin={role === 'admin'} />
            </>
          )}
        </>
      )}
    </div>
  );
}

// ---------------- TABLE COMPONENT ----------------
function Table({ data, semKey, staffId, onEdit, isAdmin }) {
  const days = Object.keys(data);
  const totalColumns = days.length + 1;
  const [edits, setEdits] = useState({});

  const handleChange = (day, index, value) => {
    const k = `${day}_${index}`;
    setEdits((s) => ({ ...s, [k]: value }));
  };

  const handleCommit = (day, index) => {
    const k = `${day}_${index}`;
    const val = edits[k] !== undefined ? edits[k] : data[day][index];
    setEdits((s) => {
      const copy = { ...s };
      delete copy[k];
      return copy;
    });
    if (!onEdit) return;
    if (semKey) onEdit(semKey, day, index, val);
    else if (staffId) onEdit(staffId, day, index, val);
  };

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Time</th>
            {days.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {timeSlots.map((time, index) => {
            const isBreak = time.toLowerCase().includes("break");

            if (isBreak) {
              return (
                <tr key={time} className="break-row">
                  <td colSpan={totalColumns}>⏸ {time}</td>
                </tr>
              );
            }

            return (
              <tr key={time}>
                <td className="time-cell">{time}</td>
                {days.map((day) => {
                  const k = `${day}_${index}`;
                  const current = edits[k] !== undefined ? edits[k] : data[day][index];
                  return (
                    <td key={day + index}>
                      {isAdmin ? (
                        <input
                          value={current}
                          onChange={(e) => handleChange(day, index, e.target.value)}
                          onBlur={() => handleCommit(day, index)}
                        />
                      ) : (
                        current
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

