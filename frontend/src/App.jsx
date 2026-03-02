import { useState } from "react";
import axios from "axios";

function App() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");

  const handleSummarize = async () => {
    try {
      const res = await axios.post("http://localhost:5000/summarize", { text });
      setSummary(res.data.summary);
    } catch (error) {
      console.log(error);
      alert("Error summarizing text");
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

      <button onClick={handleSummarize}>
        Summarize
      </button>

      <h3>Summary:</h3>
      <p>{summary}</p>
    </div>
  );
}

export default App;