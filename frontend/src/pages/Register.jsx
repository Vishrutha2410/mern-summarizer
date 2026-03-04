import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import "./Register.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await API.post("/register", { name, email, password });
      alert("Registered successfully");
      navigate("/");
    } catch(err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="register-container">
    <div className="register-card">
      <h2 className="register-title">Create Account</h2>

      <input
        className="register-input"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="register-input"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="register-btn" onClick={handleRegister}>
        Register
      </button>

      <p className="register-text">
        Already have an account?{" "}
        <Link to="/login" className="register-link">
          Login here
        </Link>
      </p>
    </div>
  </div>
  );
}