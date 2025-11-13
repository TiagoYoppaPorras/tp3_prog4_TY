
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../Auth";
import { useNavigate, useParams } from "react-router";

export const ModificarTurno = () => {
  const { fetchAuth } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [values, setValues] = useState(null);

  const fetchTurno = useCallback(async () => {
    const response = await fetchAuth(`http://localhost:3000/turnos/${id}`);
    const data = await response.json();
    if (!response.ok || !data.success) {
      console.error("Error al cargar turno");
      return;
    }
    setValues(data.turno);
  }, [fetchAuth, id]);

  useEffect(() => {
    fetchTurno();
  }, [fetchTurno]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetchAuth(`http://localhost:3000/turnos/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        estado: values.estado,
        observaciones: values.observaciones,
      }),
    });
    const data = await response.json();

    if (!response.ok || !data.success) {
      console.error(data);
      return window.alert("Error al modificar turno");
    }

    navigate("/turnos");
  };

  if (!values) return <p>Cargando turno...</p>;

  return (
    <article>
      <h2>Modificar Turno</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <p>
            <b>Paciente:</b> {values.paciente_nombre}
          </p>
          <p>
            <b>Médico:</b> {values.medico_nombre}
          </p>
          <p>
            <b>Fecha:</b> {values.fecha} — <b>Hora:</b> {values.hora}
          </p>

          <label>
            Estado
            <select
              value={values.estado}
              onChange={(e) => setValues({ ...values, estado: e.target.value })}
            >
              <option value="pendiente">Pendiente</option>
              <option value="atendido">Atendido</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </label>

          <label>
            Observaciones
            <textarea
              value={values.observaciones || ""}
              onChange={(e) =>
                setValues({ ...values, observaciones: e.target.value })
              }
            />
          </label>
        </fieldset>

        <input type="submit" value="Actualizar Turno" />
      </form>
    </article>
  );
};