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

if (!values.nombre.trim())
  return alert("El nombre es obligatorio");

if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(values.nombre))
  return alert("El nombre solo puede contener letras y espacios");

if (values.nombre.length > 50)
  return alert("El nombre no puede superar los 50 caracteres");

// Apellido
if (!values.apellido.trim())
  return alert("El apellido es obligatorio");

if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(values.apellido))
  return alert("El apellido solo puede contener letras y espacios");

if (values.apellido.length > 50)
  return alert("El apellido no puede superar los 50 caracteres");

// DNI
if (!values.dni)
  return alert("El DNI es obligatorio");

const dniNum = Number(values.dni);

if (isNaN(dniNum))
  return alert("El DNI debe ser numérico");

if (dniNum < 1000000 || dniNum > 99999999)
  return alert("El DNI debe estar entre 1.000.000 y 99.999.999");

// Fecha de nacimiento
if (!values.fecha_nacimiento)
  return alert("La fecha de nacimiento es obligatoria");

if (isNaN(Date.parse(values.fecha_nacimiento)))
  return alert("Debe ingresar una fecha válida");

// Obra social
if (!values.obra_social.trim())
  return alert("La obra social es obligatoria");

if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(values.obra_social))
  return alert("La obra social solo puede contener letras y espacios");

if (values.obra_social.length > 10)
  return alert("La obra social no puede superar los 10 caracteres");

    setErrores(null);

    const response = await fetchAuth("http://localhost:3000/pacientes", {
      method: "POST",
      body: JSON.stringify(values),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      if (response.status === 400) return setErrores(data.errores);
      return alert("Error al crear paciente");
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
              onChange={(e) => setValues({ ...values, nombre: e.target.value })}
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
                setValues({
                  ...values,
                  fecha_nacimiento: e.target.value,
                })
              }
            />
          </label>

          <label>
            Obra Social
            <input
              required
              maxLength={10}
              value={values.obra_social}
              onChange={(e) =>
                setValues({
                  ...values,
                  obra_social: e.target.value,
                })
              }
            />
          </label>
        </fieldset>

        <input type="submit" value="Guardar Paciente" />
      </form>
    </article>
  );
};