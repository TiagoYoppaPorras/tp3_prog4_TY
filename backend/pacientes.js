import express from "express";
import { db } from "./db.js";
import { validarId, verificarValidaciones } from "./validaciones.js";
import { body } from "express-validator";
import { verificarAutenticacion } from "./auth.js";

const router = express.Router();

router.get("/", verificarAutenticacion, async (req, res) => {
  const [rows] = await db.execute("SELECT * FROM pacientes");

  res.json({
    success: true,
    pacientes: rows,
  });
});

router.get(
  "/:id",
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);
    const [rows] = await db.execute(
      "SELECT id, nombre, apellido, dni, fecha_nacimiento, obra_social FROM pacientes WHERE id=?",
      [id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Paciente no encontrado" });
    }

    res.json({ success: true, paciente: rows[0] });
  }
);

router.post(
  "/",
  verificarAutenticacion,

  body("nombre")
    .isAlpha("es-ES", { ignore: " " })
    .withMessage("El nombre solo puede contener letras")
    .isLength({ min: 1, max: 50 })
    .withMessage("El nombre debe tener entre 1 y 50 caracteres"),

  body("apellido")
    .isAlpha("es-ES", { ignore: " " })
    .withMessage("El apellido solo puede contener letras")
    .isLength({ min: 1, max: 50 })
    .withMessage("El apellido debe tener entre 1 y 50 caracteres"),

  body("dni")
    .isInt({ min: 1000000, max: 99999999 })
    .withMessage("El DNI debe ser un número entre 1.000.000 y 99.999.999"),

  body("fecha_nacimiento")
    .isDate()
    .withMessage("Debe ser una fecha válida"),

  // ✔ SOLO LETRAS Y ESPACIOS
  // ✔ ENTRE 1 Y 10 CARACTERES
  body("obra_social")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,10}$/)
    .withMessage("La obra social solo puede contener letras y hasta 10 caracteres"),

  verificarValidaciones,

  async (req, res) => {
    const { nombre, apellido, dni, fecha_nacimiento, obra_social } = req.body;

    const [result] = await db.execute(
      "INSERT INTO pacientes (nombre, apellido, dni, fecha_nacimiento, obra_social) VALUES (?,?,?,?,?)",
      [nombre, apellido, dni, fecha_nacimiento, obra_social]
    );

    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        nombre,
        apellido,
        dni,
        fecha_nacimiento,
        obra_social,
      },
    });
  }
);

router.put(
  "/:id",
  verificarAutenticacion,
  validarId,

  body("nombre")
    .isAlpha("es-ES", { ignore: " " })
    .withMessage("El nombre solo puede contener letras")
    .isLength({ min: 1, max: 50 })
    .withMessage("El nombre debe tener entre 1 y 50 caracteres"),

  body("apellido")
    .isAlpha("es-ES", { ignore: " " })
    .withMessage("El apellido solo puede contener letras")
    .isLength({ min: 1, max: 50 })
    .withMessage("El apellido debe tener entre 1 y 50 caracteres"),

  body("dni")
    .isInt({ min: 1000000, max: 99999999 })
    .withMessage("El DNI debe ser un número entre 1.000.000 y 99.999.999"),

  body("fecha_nacimiento")
    .isDate()
    .withMessage("Debe ser una fecha válida"),

  // ✔ MISMA VALIDACIÓN QUE POST
  body("obra_social")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,10}$/)
    .withMessage("La obra social solo puede contener letras y hasta 10 caracteres"),

  verificarValidaciones,

  async (req, res) => {
    const id = Number(req.params.id);
    const { nombre, apellido, dni, fecha_nacimiento, obra_social } = req.body;

    const [pacientes] = await db.execute("SELECT id FROM pacientes WHERE id=?", [id]);
    if (pacientes.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Paciente no encontrado",
      });
    }

    await db.execute(
      "UPDATE pacientes SET nombre=?, apellido=?, dni=?, fecha_nacimiento=?, obra_social=? WHERE id=?",
      [nombre, apellido, dni, fecha_nacimiento, obra_social, id]
    );

    res.json({
      success: true,
      message: "Paciente actualizado correctamente",
      data: { id, nombre, apellido, dni, fecha_nacimiento, obra_social },
    });
  }
);

router.delete(
  "/:id",
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);

    const [turnos] = await db.execute(
      "SELECT COUNT(*) AS count FROM turnos WHERE paciente_id = ?",
      [id]
    );

    if (turnos[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: "No se puede eliminar el paciente porque tiene turnos asignados.",
      });
    }

    const [result] = await db.execute("DELETE FROM pacientes WHERE id=?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Paciente no encontrado",
      });
    }

    res.json({
      success: true,
      message: "Paciente eliminado correctamente",
      data: id,
    });
  }
);

export default router;