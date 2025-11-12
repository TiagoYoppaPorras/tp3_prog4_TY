import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router";
import { useAuth } from "../Auth";

export const Pacientes = () => {
  const { fetchAuth } = useAuth();
  const [pacientes, setPacientes] = useState([]);

  const fetchPacientes = useCallback(async () => {
    const response = await fetchAuth("http://localhost:3000/pacientes");
    const data = await response.json();
    if (!response.ok || !data.success) {
      console.error("Error al cargar pacientes");
      return;
    }
    setPacientes(data.pacientes);
  }, [fetchAuth]);

  useEffect(() => {
    fetchPacientes();
  }, [fetchPacientes]);

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Desea eliminar este paciente?")) return;
    const response = await fetchAuth(`http://localhost:3000/pacientes/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      return window.alert("Error al eliminar paciente");
    }
    fetchPacientes();
  };

  return (
    <article>
      <h2>Pacientes</h2>
      <Link role="button" to="/pacientes/crear">
        Nuevo Paciente
      </Link>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>DNI</th>
            <th>Fecha Nacimiento</th>
            <th>Obra Social</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pacientes.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nombre}</td>
              <td>{p.apellido}</td>
              <td>{p.dni}</td>
              <td>{p.fecha_nacimiento}</td>
              <td>{p.obra_social}</td>
              <td>
                <div>
                  <Link
                    role="button"
                    to={`/pacientes/${p.id}/modificar`}
                    style={{ marginRight: "0.5rem" }}
                  >
                    Modificar
                  </Link>
                  <button onClick={() => handleEliminar(p.id)}>Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
};
