import { useState } from "react";
import { useNavigate, Link} from "react-router-dom";
import API from "../utils/api";
import "./Login.css";

export default function Login({setToken}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="login-container">
    <div className="login-card">
      <h2 className="login-title">Welcome Back</h2>

      <input
        className="login-input"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="login-input"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="login-btn" onClick={handleLogin}>
        Login
      </button>

      <p className="login-text">
        Don't have an account?{" "}
        <Link to="/register" className="login-link">
          Register here
        </Link>
      </p>
    </div>
  </div>
  );
}