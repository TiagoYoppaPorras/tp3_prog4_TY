
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


if (!values.nombre?.trim())
  return window.alert("El nombre es obligatorio");

if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(values.nombre))
  return window.alert("El nombre solo puede contener letras");

if (values.nombre.trim().length < 1 || values.nombre.trim().length > 50)
  return window.alert("El nombre debe tener entre 1 y 50 caracteres");

// APELLIDO
if (!values.apellido?.trim())
  return window.alert("El apellido es obligatorio");

if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(values.apellido))
  return window.alert("El apellido solo puede contener letras");

if (values.apellido.trim().length < 1 || values.apellido.trim().length > 50)
  return window.alert("El apellido debe tener entre 1 y 50 caracteres");

// ESPECIALIDAD
if (!values.especialidad?.trim())
  return window.alert("La especialidad es obligatoria");

if (values.especialidad.trim().length < 1 || values.especialidad.trim().length > 100)
  return window.alert("La especialidad debe tener entre 1 y 100 caracteres");

// MATRÍCULA PROFESIONAL
if (!values.matricula_profesional?.trim())
  return window.alert("La matrícula profesional es obligatoria");

if (!/^[a-zA-Z0-9]+$/.test(values.matricula_profesional))
  return window.alert("La matrícula solo puede contener letras y números");

if (
  values.matricula_profesional.trim().length < 1 ||
  values.matricula_profesional.trim().length > 50
)
  return window.alert("La matrícula debe tener entre 1 y 50 caracteres");
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

