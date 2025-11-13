import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router";
import { useAuth } from "../Auth";

export const Medicos = () => {
  const { fetchAuth } = useAuth();
  const [medicos, setMedicos] = useState([]);

  const fetchMedicos = useCallback(async () => {
    const response = await fetchAuth("http://localhost:3000/medicos");
    const data = await response.json();
    if (!response.ok || !data.success) {
      console.error("Error al cargar médicos");
      return;
    }
    setMedicos(data.medicos);
  }, [fetchAuth]);

  useEffect(() => {
    fetchMedicos();
  }, [fetchMedicos]);

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Desea eliminar este médico?")) return;
    const response = await fetchAuth(`http://localhost:3000/medicos/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      return window.alert("Error al eliminar médico");
    }
    fetchMedicos();
  };

  return (
    <article>
      <h2>Médicos</h2>
      <Link role="button" to="/medicos/crear">
        Nuevo Médico
      </Link>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Especialidad</th>
            <th>Matrícula</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {medicos.map((m) => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.nombre}</td>
              <td>{m.apellido}</td>
              <td>{m.especialidad}</td>
              <td>{m.matricula_profesional}</td>
              <td>
                <div>
                  <Link
                    role="button"
                    to={`/medicos/${m.id}/modificar`}
                    style={{ marginRight: "0.5rem" }}
                  >
                    Modificar
                  </Link>
                  <button onClick={() => handleEliminar(m.id)}>Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
};

