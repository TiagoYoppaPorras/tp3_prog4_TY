import express from "express";
import { db } from "./db.js";
import { validarId, verificarValidaciones } from "./validaciones.js";
import { body } from "express-validator";
import { verificarAutenticacion } from "./auth.js";

const router = express.Router();

router.get("/", verificarAutenticacion, async (req, res) => {
  const [rows] = await db.execute("SELECT * FROM medicos");

  res.json({
    success: true,
    medicos: rows,
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
      "SELECT id, nombre, apellido, especialidad, matricula_profesional FROM medicos WHERE id=?",
      [id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Médico no encontrado" });
    }

    res.json({ success: true, medico: rows[0] });
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
  body("especialidad", "Especialidad inválida")
    .isLength({ min: 1, max: 100 })
    .withMessage("La especialidad debe tener entre 1 y 100 caracteres"),
  body("matricula_profesional", "Matrícula profesional inválida")
    .isAlphanumeric("es-ES")
    .withMessage("La matrícula solo puede contener letras y números")
    .isLength({ min: 1, max: 50 })
    .withMessage("La matrícula debe tener entre 1 y 50 caracteres"),
  verificarValidaciones,
  async (req, res) => {
    const { nombre, apellido, especialidad, matricula_profesional } = req.body;

    const [result] = await db.execute(
      "INSERT INTO medicos (nombre, apellido, especialidad, matricula_profesional) VALUES (?,?,?,?)",
      [nombre, apellido, especialidad, matricula_profesional]
    );

    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        nombre,
        apellido,
        especialidad,
        matricula_profesional,
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
  body("especialidad", "Especialidad inválida")
    .isLength({ min: 1, max: 100 })
    .withMessage("La especialidad debe tener entre 1 y 100 caracteres"),
  body("matricula_profesional", "Matrícula profesional inválida")
    .isAlphanumeric("es-ES")
    .withMessage("La matrícula solo puede contener letras y números")
    .isLength({ min: 1, max: 50 })
    .withMessage("La matrícula debe tener entre 1 y 50 caracteres"),
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);
    const { nombre, apellido, especialidad, matricula_profesional } = req.body;

    const [medicos] = await db.execute("SELECT id FROM medicos WHERE id=?", [
      id,
    ]);
    if (medicos.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Médico no encontrado",
      });
    }

    await db.execute(
      "UPDATE medicos SET nombre=?, apellido=?, especialidad=?, matricula_profesional=? WHERE id=?",
      [nombre, apellido, especialidad, matricula_profesional, id]
    );

    res.json({
      success: true,
      message: "Médico actualizado correctamente",
      data: { id, nombre, apellido, especialidad, matricula_profesional },
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
      "SELECT COUNT(*) as count FROM turnos WHERE medico_id = ?", 
      [id]
    );
    
    if (turnos[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: "No se puede eliminar el médico porque tiene turnos asignados. Elimine primero los turnos asociados."
      });
    }

    const [result] = await db.execute("DELETE FROM medicos WHERE id=?", [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Médico no encontrado"
      });
    }

    res.json({ 
      success: true, 
      message: "Médico eliminado correctamente",
      data: id 
    });
  }
);

export default router;