import { useEffect, useState } from "react";
import { useAuth } from "../Auth";
import { useNavigate } from "react-router";

export const CrearTurno = () => {
  const { fetchAuth } = useAuth();
  const navigate = useNavigate();

  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);

  const [values, setValues] = useState({
    paciente_id: "",
    medico_id: "",
    fecha: "",
    hora: "",
    estado: "pendiente",
    observaciones: "",
  });

  
  useEffect(() => {
    const cargarDatos = async () => {
      const resPacientes = await fetchAuth("http://localhost:3000/pacientes");
      const dataP = await resPacientes.json();
      if (resPacientes.ok && dataP.success) setPacientes(dataP.pacientes);

      const resMedicos = await fetchAuth("http://localhost:3000/medicos");
      const dataM = await resMedicos.json();
      if (resMedicos.ok && dataM.success) setMedicos(dataM.medicos);
    };
    cargarDatos();
  }, [fetchAuth]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.paciente_id)
  return window.alert("Seleccione un paciente");

const pacienteIdNum = Number(form.paciente_id);

if (isNaN(pacienteIdNum) || pacienteIdNum < 1)
  return window.alert("El ID del paciente debe ser un número entero positivo");


if (!form.medico_id)
  return window.alert("Seleccione un médico");

const medicoIdNum = Number(form.medico_id);

if (isNaN(medicoIdNum) || medicoIdNum < 1)
  return window.alert("El ID del médico debe ser un número entero positivo");


if (!form.fecha)
  return window.alert("La fecha es obligatoria");

if (!/^\d{4}-\d{2}-\d{2}$/.test(form.fecha))
  return window.alert("La fecha debe estar en formato YYYY-MM-DD");


if (isNaN(Date.parse(form.fecha)))
  return window.alert("La fecha no es válida");


if (!form.hora)
  return window.alert("La hora es obligatoria");

if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(form.hora))
  return window.alert("La hora debe estar en formato HH:MM (24 horas)");


if (!["pendiente", "atendido", "cancelado"].includes(form.estado))
  return window.alert("El estado debe ser: pendiente, atendido o cancelado");

if (form.observaciones && form.observaciones.length > 500)
  return window.alert("Las observaciones no pueden tener más de 500 caracteres");
    const response = await fetchAuth("http://localhost:3000/turnos", {
      method: "POST",
      body: JSON.stringify(values),
    });
    const data = await response.json();

    if (!response.ok || !data.success) {
      console.error(data);
      return window.alert("Error al crear turno");
    }

    navigate("/turnos");
  };

  return (
    <article>
      <h2>Nuevo Turno</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>
            Paciente
            <select
              required
              value={values.paciente_id}
              onChange={(e) =>
                setValues({ ...values, paciente_id: e.target.value })
              }
            >
              <option value="">Seleccione un paciente</option>
              {pacientes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} {p.apellido}
                </option>
              ))}
            </select>
          </label>

          <label>
            Médico
            <select
              required
              value={values.medico_id}
              onChange={(e) =>
                setValues({ ...values, medico_id: e.target.value })
              }
            >
              <option value="">Seleccione un médico</option>
              {medicos.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre} {m.apellido} - {m.especialidad}
                </option>
              ))}
            </select>
          </label>

          <label>
            Fecha
            <input
              type="date"
              required
              value={values.fecha}
              onChange={(e) => setValues({ ...values, fecha: e.target.value })}
            />
          </label>

          <label>
            Hora
            <input
              type="time"
              required
              value={values.hora}
              onChange={(e) => setValues({ ...values, hora: e.target.value })}
            />
          </label>

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
              value={values.observaciones}
              onChange={(e) =>
                setValues({ ...values, observaciones: e.target.value })
              }
            />
          </label>
        </fieldset>
        <input type="submit" value="Guardar Turno" />
      </form>
    </article>
  );
};
