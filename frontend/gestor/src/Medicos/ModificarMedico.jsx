
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../Auth";
import { useNavigate, useParams } from "react-router";

export const ModificarMedico = () => {
  const { fetchAuth } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [values, setValues] = useState(null);
  const [errores, setErrores] = useState(null);

  const fetchMedico = useCallback(async () => {
    const response = await fetchAuth(`http://localhost:3000/medicos/${id}`);
    const data = await response.json();
    if (!response.ok || !data.success) {
      console.error("Error al cargar médico");
      return;
    }
    setValues(data.medico);
  }, [fetchAuth, id]);

  useEffect(() => {
    fetchMedico();
  }, [fetchMedico]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrores(null);

    const response = await fetchAuth(`http://localhost:3000/medicos/${id}`, {
      method: "PUT",
      body: JSON.stringify(values),
    });
    const data = await response.json();

    if (!response.ok || !data.success) {
      if (response.status === 400) {
        setErrores(data.errores);
        return;
      }
      return window.alert("Error al modificar médico");
    }

    navigate("/medicos");
  };

  if (!values) return <p>Cargando médico...</p>;

  return (
    <article>
      <h2>Modificar Médico</h2>
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
        <input type="submit" value="Actualizar Médico" />
      </form>
    </article>
  );
};

