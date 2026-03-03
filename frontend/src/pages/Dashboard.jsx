import { useState, useEffect } from "react";
import API from "../utils/api";
import jsPDF from "jspdf";

function Dashboard() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // ✅ Fetch history
  const fetchHistory = async () => {
    try {
      const res = await API.get("/my-summaries");
      setHistory(res.data);
    } catch (err) {
      console.log("History error:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // ✅ Summarize
  const handleSummarize = async () => {
    if (!text.trim()) return alert("Please enter text first!");

    setLoading(true);
    try {
      const res = await API.post("/summarize", { text });

      setSummary(res.data.summary);
      fetchHistory();
    } catch (error) {
      console.log(error);
      alert("Error summarizing text");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Copy
  const copyText = () => {
    if (!summary) return;
    navigator.clipboard.writeText(summary);
    alert("Copied!");
  };

  // ✅ Download PDF
  const downloadPDF = () => {
    if (!summary) return alert("No summary to download!");

    const doc = new jsPDF();
    doc.text(summary, 10, 10);
    doc.save("summary.pdf");
  };


  // ✅ Delete
  const deleteSummary = async (id) => {
    try {
      await API.delete(`/summary/${id}`);
      fetchHistory();
    } catch (err) {
      console.log("Delete error:", err);
    }
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