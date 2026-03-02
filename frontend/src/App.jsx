import { useState } from "react";
import axios from "axios";

function App() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading]=useState(false);

  const handleSummarize = async () => {
    if (!text.trim()) return alert("Please enter text first!");
    setLoading(true);
    try {
      const res = await axios.post
        (`${import.meta.env.VITA_API_URL}/summarize`,{text});
      setSummary(res.data.summary);
    } catch (error) {
      console.log("Axios error:", error.response ? error.response.data : error.message);
      alert("Error summarizing text");
    }finally{
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>🧠 MERN Text Summarizer</h1>

      <textarea
        rows="10"
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
    </div>
  );
}

export default App;