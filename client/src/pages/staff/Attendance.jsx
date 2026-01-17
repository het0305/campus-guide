import { useState } from "react";
import * as XLSX from "xlsx";
import axios from 'axios'

export default function Attendance() {
  const [data, setData] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const binaryStr = evt.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const parsedData = XLSX.utils.sheet_to_json(sheet);
      setData(parsedData);
      // auto-save parsed attendance to server
      saveAttendance(parsedData);
    };
    reader.readAsBinaryString(file);
  };

  const saveAttendance = async (records) => {
    try{
      const date = new Date().toISOString();
      const res = await axios.post('/api/attendance', { date, records });
      alert(`Saved ${res.data.inserted} records`);
      setData([]);
    }catch(er){
      console.error(er);
      const msg = er.response && er.response.data && er.response.data.error ? er.response.data.error : er.message || 'Failed to save attendance';
      alert(msg)
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>📊 Student Attendance Upload</h2>

      <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} />

      {data.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <button onClick={async ()=>{
            try{
              // send parsed rows to server; default date = today
              const date = new Date().toISOString();
              const res = await axios.post('/api/attendance', { date, records: data });
              alert(`Saved ${res.data.inserted} records`);
              setData([]);
            }catch(er){
              console.error(er);
              const msg = er.response && er.response.data && er.response.data.error ? er.response.data.error : er.message || 'Failed to save attendance';
              alert(msg)
            }
          }}>Save to database</button>
        </div>
      )}
      {data.length > 0 && (
        <>
          <h3 style={{ marginTop: 20 }}>Preview</h3>

          <table border="1" cellPadding="8">
            <thead>
              <tr>
                {Object.keys(data[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((val, i) => (
                    <td key={i}>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
