import { useState } from "react";
import { useNavigate } from "react-router";

export const Registro = () => {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Nombre
    if (!nombre.trim())
      return alert("El nombre es obligatorio");

    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre))
      return alert("El nombre solo puede contener letras y espacios");

    if (nombre.trim().length > 50)
      return alert("El nombre no puede superar los 50 caracteres");

    // Email
    if (!email.trim())
      return alert("El email es obligatorio");

    if (email.trim().length > 100)
      return alert("El email no puede tener más de 100 caracteres");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return alert("Debe ingresar un email válido");

    // Password
    if (!password.trim())
      return alert("La contraseña es obligatoria");

    if (password.length < 8)
      return alert("La contraseña debe tener al menos 8 caracteres");

    if (!/[a-z]/.test(password))
      return alert("La contraseña debe contener al menos una letra minúscula");

    if (!/[A-Z]/.test(password))
      return alert("La contraseña debe contener al menos una letra mayúscula");

    if (!/[0-9]/.test(password))
      return alert("La contraseña debe contener al menos un número");

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      return alert("La contraseña debe contener al menos un símbolo");

    const endpoint = "http://localhost:3000/usuarios";
    const body = { nombre, password, email };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (res.ok) {

      // Limpiar formulario
      setNombre("");
      setPassword("");
      setEmail("");

      navigate("/login");
    } else {
      const error = await res.json();
      console.log("Error en el registro:", error);

      if (error.errores) {
        return alert(error.errores[0].msg);
      }

      alert("Error al registrar usuario");
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