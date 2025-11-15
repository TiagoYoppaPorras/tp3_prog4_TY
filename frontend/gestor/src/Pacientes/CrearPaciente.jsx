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


if (!form.nombre?.trim())
  return window.alert("El nombre es obligatorio");

if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(form.nombre))
  return window.alert("El nombre solo puede contener letras");

if (form.nombre.trim().length < 1 || form.nombre.trim().length > 50)
  return window.alert("El nombre debe tener entre 1 y 50 caracteres");


if (!form.apellido?.trim())
  return window.alert("El apellido es obligatorio");

if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(form.apellido))
  return window.alert("El apellido solo puede contener letras");

if (form.apellido.trim().length < 1 || form.apellido.trim().length > 50)
  return window.alert("El apellido debe tener entre 1 y 50 caracteres");

if (!form.dni)
  return window.alert("El DNI es obligatorio");

const dniNum = Number(form.dni);

if (isNaN(dniNum))
  return window.alert("El DNI debe ser numérico");

if (dniNum < 1000000 || dniNum > 99999999)
  return window.alert("El DNI debe ser un número entre 1.000.000 y 99.999.999");


if (!form.fecha_nacimiento)
  return window.alert("La fecha de nacimiento es obligatoria");

if (isNaN(Date.parse(form.fecha_nacimiento)))
  return window.alert("Debe ser una fecha válida");


if (form.obra_social && form.obra_social.length > 100)
  return window.alert("La obra social no puede tener más de 100 caracteres");
    setErrores(null);

    const response = await fetchAuth("http://localhost:3000/pacientes", {
      method: "POST",
      body: JSON.stringify(values),
    });
    const data = await response.json();

    if (!response.ok || !data.success) {
      if (response.status === 400) {
        setErrores(data.errores);
        return;
      }
      return window.alert("Error al crear paciente");
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
        <input type="submit" value="Guardar Paciente" />
      </form>
    </article>
  );
};
