
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router";
import { useAuth } from "../Auth";

export const Turnos = () => {
  const { fetchAuth } = useAuth();
  const [turnos, setTurnos] = useState([]);

  const fetchTurnos = useCallback(async () => {
    const response = await fetchAuth("http://localhost:3000/turnos");
    const data = await response.json();
    if (!response.ok || !data.success) {
      console.error("Error al cargar turnos");
      return;
    }
    setTurnos(data.turnos);
  }, [fetchAuth]);

  useEffect(() => {
    fetchTurnos();
  }, [fetchTurnos]);

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Desea eliminar este turno?")) return;
    const response = await fetchAuth(`http://localhost:3000/turnos/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      return window.alert("Error al eliminar turno");
    }
    fetchTurnos();
  };

  return (
    <article>
      <h2>Turnos</h2>
      <Link role="button" to="/turnos/crear">
        Nuevo Turno
      </Link>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Paciente</th>
            <th>Médico</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Estado</th>
            <th>Observaciones</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {turnos.map((t) => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.paciente_nombre}</td>
              <td>{t.medico_nombre}</td>
              <td>{t.fecha}</td>
              <td>{t.hora}</td>
              <td>{t.estado}</td>
              <td>{t.observaciones}</td>
              <td>
                <div>
                  <Link
                    role="button"
                    to={`/turnos/${t.id}/modificar`}
                    style={{ marginRight: "0.5rem" }}
                  >
                    Editar
                  </Link>
                  <button onClick={() => handleEliminar(t.id)}>Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
};
