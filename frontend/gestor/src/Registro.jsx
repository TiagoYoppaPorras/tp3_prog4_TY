import { useState } from "react";
import { useNavigate } from "react-router";

export const Registro = () => {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = "http://localhost:3000/usuarios";

    const body = {
      nombre,
      password,
      email
    };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (res.ok) {
      // limpiar inputs
      setNombre("");
      setPassword("");
      setEmail("");

      // redirigir al login
      navigate("/login");
    } else {
      console.log("Error en el registro:", await res.text());
    }
  };

  return (
    <main className="container">
      <article>
        <h2>Registro</h2>

        <form onSubmit={handleSubmit}>
          <label>
            Nombre
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button type="submit">Registrarme</button>
        </form>
      </article>
    </main>
  );
};
