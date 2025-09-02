import { useState } from "react";
import axios from "axios";

export default function App() {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);

  const checkBackend = async () => {
    try {
      const res = await axios.get("/api/");
      setMessage(res.data.message);
    } catch (err) {
      setMessage("Error connecting to backend");
    }
  };

  const uploadFile = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post("/api/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(`Uploaded: ${res.data.filename}, Rows: ${res.data.rows}`);
    } catch (err) {
      setMessage("File upload failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Frontend - ROI App</h1>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded m-2"
        onClick={checkBackend}
      >
        Check Backend
      </button>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="m-2"
      />
      <button
        className="bg-green-500 text-white px-4 py-2 rounded"
        onClick={uploadFile}
      >
        Upload CSV
      </button>

      <p className="mt-4">{message}</p>
    </div>
  );
}
