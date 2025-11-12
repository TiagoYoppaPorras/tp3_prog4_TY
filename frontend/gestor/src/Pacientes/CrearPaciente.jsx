import { useState } from "react";
import { useAuth } from "../Auth";
import { useNavigate } from "react-router";

export const CrearPaciente = () => {
  const { fetchAuth } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    fecha_nacimiento: "",
    obra_social: "",
  });
  const [errores, setErrores] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrores(null);

    const response = await fetchAuth("http://localhost:3000/pacientes", {
      method: "POST",
      body: JSON.stringify(values),
    });
    const data = await response.json();

    if (!response.ok || !data.success) {
      if (response.status === 400) {
        setErrores(data.errores);
        return;
      }
      return window.alert("Error al crear paciente");
    }

    navigate("/pacientes");
  };

  return (
    <article>
      <h2>Nuevo Paciente</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>
            Nombre
            <input
              required
              value={values.nombre}
              onChange={(e) =>
                setValues({ ...values, nombre: e.target.value })
              }
            />
          </label>
          <label>
            Apellido
            <input
              required
              value={values.apellido}
              onChange={(e) =>
                setValues({ ...values, apellido: e.target.value })
              }
            />
          </label>
          <label>
            DNI
            <input
              type="number"
              required
              value={values.dni}
              onChange={(e) => setValues({ ...values, dni: e.target.value })}
            />
          </label>
          <label>
            Fecha de Nacimiento
            <input
              type="date"
              required
              value={values.fecha_nacimiento}
              onChange={(e) =>
                setValues({ ...values, fecha_nacimiento: e.target.value })
              }
            />
          </label>
          <label>
            Obra Social
            <input
              value={values.obra_social}
              onChange={(e) =>
                setValues({ ...values, obra_social: e.target.value })
              }
            />
          </label>
        </fieldset>
        <input type="submit" value="Guardar Paciente" />
      </form>
    </article>
  );
};
