import { useState, useEffect } from "react";
import API from "../utils/api";
import jsPDF from "jspdf";

function Dashboard() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const token = localStorage.getItem("token");

  const fetchHistory = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/my-summaries`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }
      );
      setHistory(res.data);
    } catch (err) {
      console.log("History error");
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSummarize = async () => {
    if (!text.trim()) return alert("Please enter text first!");

    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/summarize`,
        { text },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token") }`
        }
    });

      setSummary(res.data.summary);
      fetchHistory();

    } catch (error) {
      alert("Error summarizing text");
    } finally {
      setLoading(false);
    }
  };

  const copyText = () => {
    navigator.clipboard.writeText(summary);
    alert("Copied!");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text(summary, 10, 10);
    doc.save("summary.pdf");
  };

  const deleteSummary = async (id) => {
    await axios.delete(
      `${import.meta.env.VITE_API_URL}/summary/${id}`,
      {
        headers: { Authorization: token }
      }
    );
    fetchHistory();
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>🧠 Dashboard</h1>

      <textarea
        rows="8"
        cols="60"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text here..."
      />

      <br /><br />

      <button onClick={handleSummarize} disabled={loading}>
        {loading ? "Summarizing..." : "Summarize"}
      </button>

      <h3>Summary:</h3>
      <p>{summary}</p>

      <button onClick={copyText}>Copy</button>
      <button onClick={downloadPDF}>Download PDF</button>

      <h3>Previous Summaries:</h3>
      {history.map((item) => (
        <div key={item._id}>
          <p>{item.summary}</p>
          <button onClick={() => deleteSummary(item._id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;