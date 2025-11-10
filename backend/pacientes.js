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
  body("nombre", "Nombre inválido")
    .isAlpha("es-ES", { ignore: " " })
    .withMessage("El nombre solo puede contener letras")
    .isLength({ min: 1, max: 50 })
    .withMessage("El nombre debe tener entre 1 y 50 caracteres"),
  body("apellido", "Apellido inválido")
    .isAlpha("es-ES", { ignore: " " })
    .withMessage("El apellido solo puede contener letras")
    .isLength({ min: 1, max: 50 })
    .withMessage("El apellido debe tener entre 1 y 50 caracteres"),
  body("dni", "DNI inválido")
    .isInt({ min: 1000000, max: 99999999 })
    .withMessage("El DNI debe ser un número entre 1.000.000 y 99.999.999"),
  body("fecha_nacimiento", "Fecha de nacimiento inválida")
    .isDate()
    .withMessage("Debe ser una fecha válida"),
  body("obra_social", "Obra social inválida")
    .isLength({ max: 100 })
    .withMessage("La obra social no puede tener más de 100 caracteres"),
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
  body("nombre", "Nombre inválido")
    .isAlpha("es-ES", { ignore: " " })
    .withMessage("El nombre solo puede contener letras")
    .isLength({ min: 1, max: 50 })
    .withMessage("El nombre debe tener entre 1 y 50 caracteres"),
  body("apellido", "Apellido inválido")
    .isAlpha("es-ES", { ignore: " " })
    .withMessage("El apellido solo puede contener letras")
    .isLength({ min: 1, max: 50 })
    .withMessage("El apellido debe tener entre 1 y 50 caracteres"),
  body("dni", "DNI inválido")
    .isInt({ min: 1000000, max: 99999999 })
    .withMessage("El DNI debe ser un número entre 1.000.000 y 99.999.999"),
  body("fecha_nacimiento", "Fecha de nacimiento inválida")
    .isDate()
    .withMessage("Debe ser una fecha válida"),
  body("obra_social", "Obra social inválida")
    .isLength({ max: 100 })
    .withMessage("La obra social no puede tener más de 100 caracteres"),
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);
    const { nombre, apellido, dni, fecha_nacimiento, obra_social } = req.body;

    // Verificar que el paciente existe
    const [pacientes] = await db.execute("SELECT id FROM pacientes WHERE id=?", [id]);
    if (pacientes.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Paciente no encontrado" 
      });
    }

    await db.execute(
      "UPDATE pacientes SET nombre=?, apellido=?, dni=?, fecha_nacimiento=?, obra_social=? WHERE id=?",
      [nombre, apellido, dni, fecha_nacimiento, obra_social, id]
    );

    res.json({ 
      success: true, 
      message: "Paciente actualizado correctamente",
      data: { id, nombre, apellido, dni, fecha_nacimiento, obra_social }
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

    await db.execute("DELETE FROM pacientes WHERE id=?", [id]);
    res.json({ success: true, data: id });
  }
);

export default router;