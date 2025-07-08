import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Login.css";
import AlertaGlobal from "../components/AlertaGlobal";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alerta, setAlerta] = useState({ open: false, message: "", severity: "error" });

  const mostrarAlerta = (message, severity = "error") => {
    setAlerta({ open: true, message, severity });
  };

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
      if (res.data.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/conductor");
      }
    } catch {
      mostrarAlerta("❌ Credenciales inválidas", "error");
    }
  };

  return (
    <div className="login-wrapper">
      <AlertaGlobal
        open={alerta.open}
        message={alerta.message}
        severity={alerta.severity}
        onClose={() => setAlerta({ ...alerta, open: false })}
      />
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
