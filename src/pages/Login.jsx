// File: /frontend/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Login.css";
import Conductor from "./Conductor";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/login", { username, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: res.data.username,
          role: res.data.role,
          id: res.data.userId,
          token: res.data.token,
        })
      );
      console.log(res.data.role);
      if (res.data.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/conductor");
      }
    } catch {
      alert("❌ Credenciales inválidas");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Ingresar</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
