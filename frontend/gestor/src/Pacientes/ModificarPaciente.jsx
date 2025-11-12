
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../Auth";
import { useNavigate, useParams } from "react-router";

export const ModificarPaciente = () => {
  const { fetchAuth } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [values, setValues] = useState(null);
  const [errores, setErrores] = useState(null);

  const fetchPaciente = useCallback(async () => {
    const response = await fetchAuth(`http://localhost:3000/pacientes/${id}`);
    const data = await response.json();
    if (!response.ok || !data.success) {
      console.error("Error al cargar paciente");
      return;
    }
    setValues(data.paciente);
  }, [fetchAuth, id]);

  useEffect(() => {
    fetchPaciente();
  }, [fetchPaciente]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrores(null);

    const response = await fetchAuth(`http://localhost:3000/pacientes/${id}`, {
      method: "PUT",
      body: JSON.stringify(values),
    });
    const data = await response.json();

    if (!response.ok || !data.success) {
      if (response.status === 400) {
        setErrores(data.errores);
        return;
      }
      return window.alert("Error al modificar paciente");
    }

    navigate("/pacientes");
  };

  if (!values) return <p>Cargando paciente...</p>;

  return (
    <article>
      <h2>Modificar Paciente</h2>
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
        <input type="submit" value="Actualizar Paciente" />
      </form>
    </article>
  );
};
