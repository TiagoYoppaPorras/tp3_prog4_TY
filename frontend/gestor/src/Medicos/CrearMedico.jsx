
import { useState } from "react";
import { useAuth } from "../Auth";
import { useNavigate } from "react-router";

export const CrearMedico = () => {
  const { fetchAuth } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    nombre: "",
    apellido: "",
    especialidad: "",
    matricula_profesional: "",
  });
  const [errores, setErrores] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrores(null);

    const response = await fetchAuth("http://localhost:3000/medicos", {
      method: "POST",
      body: JSON.stringify(values),
    });
    const data = await response.json();

    if (!response.ok || !data.success) {
      if (response.status === 400) {
        setErrores(data.errores);
        return;
      }
      return window.alert("Error al crear médico");
    }

    navigate("/medicos");
  };

  return (
    <article>
      <h2>Nuevo Médico</h2>
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
            Especialidad
            <input
              required
              value={values.especialidad}
              onChange={(e) =>
                setValues({ ...values, especialidad: e.target.value })
              }
            />
          </label>
          <label>
            Matrícula Profesional
            <input
              required
              value={values.matricula_profesional}
              onChange={(e) =>
                setValues({
                  ...values,
                  matricula_profesional: e.target.value,
                })
              }
            />
          </label>
        </fieldset>
        <input type="submit" value="Guardar Médico" />
      </form>
    </article>
  );
};

