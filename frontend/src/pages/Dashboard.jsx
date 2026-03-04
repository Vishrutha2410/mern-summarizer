import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import jsPDF from "jspdf";

function Dashboard({setToken}) {
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
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 10;

  // Wrap text to page width
  const textLines = doc.splitTextToSize(summary, pageWidth - 2 * margin);

  let y = 20; // start position

  textLines.forEach((line, index) => {
    if (y > 280) { // A4 page height approx 297mm, leave bottom margin
      doc.addPage();
      y = 20; // reset y for new page
    }
    doc.text(line, margin, y);
    y += 10; // line height
  });

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
  const navigate=useNavigate();
  const handleLogout = () => {
  localStorage.removeItem("token");
  setToken(null);
  navigate("/login");
};

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 to-black text-white p-10">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">🧠 AI Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-xl transition duration-300"
        >
          Logout
        </button>
      </div>

      {/* Textarea */}
      <textarea
        rows="6"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text here..."
        className="w-full p-4 rounded-xl bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />

      {/* Summarize Button */}
      <button
        onClick={handleSummarize}
        disabled={loading}
        className="mt-4 bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-xl transition duration-300"
      >
        {loading ? "Summarizing..." : "Summarize"}
      </button>
     
      {/* Summary Card */}
      {summary && (
        <div className="mt-8 bg-gray-800 p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Summary</h3>
          <p className="text-gray-300">{summary}</p>

          <div className="mt-4 flex gap-4">
            <button
              onClick={copyText}
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-xl transition"
            >
              Copy
            </button>

            <button
              onClick={downloadPDF}
              className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-xl transition"
            >
              Download PDF
            </button>
          </div>
        </div>
      )}

      {/* History Section */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">Previous Summaries</h3>

        {history.length === 0 ? (
          <p className="text-gray-400">No summaries yet.</p>
        ) : (
          history.map((item) => (
            <div
              key={item._id}
              className="bg-gray-800 p-5 rounded-2xl mb-4 shadow-md"
            >
              <p className="text-gray-300">{item.summary}</p>

              <button
                onClick={() => deleteSummary(item._id)}
                className="mt-3 bg-red-500 hover:bg-red-600 px-4 py-1 rounded-lg transition"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default Dashboard;