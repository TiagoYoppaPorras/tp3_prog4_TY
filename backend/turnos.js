import express from "express";
import { db } from "./db.js";
import { validarId, verificarValidaciones } from "./validaciones.js";
import { body } from "express-validator";
import { verificarAutenticacion } from "./auth.js";

const router = express.Router();

router.get("/", verificarAutenticacion, async (req, res) => {
  const [rows] = await db.execute(`
    SELECT 
      t.id,
      p.nombre AS paciente_nombre,
      p.apellido AS paciente_apellido,
      m.nombre AS medico_nombre,
      m.apellido AS medico_apellido,
      t.fecha,
      t.hora,
      t.estado,
      t.observaciones
    FROM turnos t
    JOIN pacientes p ON t.paciente_id = p.id
    JOIN medicos m ON t.medico_id = m.id
  `);

  res.json({
    success: true,
    turnos: rows,
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
      `
      SELECT 
        t.id,
        p.nombre AS paciente_nombre,
        p.apellido AS paciente_apellido,
        m.nombre AS medico_nombre,
        m.apellido AS medico_apellido,
        t.fecha,
        t.hora,
        t.estado,
        t.observaciones
      FROM turnos t
      JOIN pacientes p ON t.paciente_id = p.id
      JOIN medicos m ON t.medico_id = m.id
      WHERE t.id = ?
    `,
      [id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Turno no encontrado" });
    }

    res.json({ success: true, turno: rows[0] });
  }
);

router.post(
  "/",
  verificarAutenticacion,
  body("paciente_id", "ID de paciente inválido")
    .isInt({ min: 1 })
    .withMessage("El ID del paciente debe ser un número entero positivo"),
  body("medico_id", "ID de médico inválido")
    .isInt({ min: 1 })
    .withMessage("El ID del médico debe ser un número entero positivo"),
  body("fecha", "Fecha inválida")
    .isDate()
    .withMessage("Debe ser una fecha válida en formato YYYY-MM-DD"),
  body("hora", "Hora inválida")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("La hora debe estar en formato HH:MM (24 horas)"),
  body("estado", "Estado inválido")
    .isIn(["pendiente", "atendido", "cancelado"])
    .withMessage("El estado debe ser: pendiente, atendido o cancelado"),
  body("observaciones", "Observaciones inválidas")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Las observaciones no pueden tener más de 500 caracteres"),
  verificarValidaciones,
  async (req, res) => {
    const { paciente_id, medico_id, fecha, hora, estado, observaciones } =
      req.body;

    const [result] = await db.execute(
      "INSERT INTO turnos (paciente_id, medico_id, fecha, hora, estado, observaciones) VALUES (?,?,?,?,?,?)",
      [paciente_id, medico_id, fecha, hora, estado, observaciones]
    );

    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        paciente_id,
        medico_id,
        fecha,
        hora,
        estado,
        observaciones,
      },
    });
  }
);

router.put(
  "/:id",
  verificarAutenticacion,
  validarId,
  body("estado", "Estado inválido")
    .isIn(["pendiente", "atendido", "cancelado"])
    .withMessage("El estado debe ser: pendiente, atendido o cancelado"),
  body("observaciones", "Observaciones inválidas")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Las observaciones no pueden tener más de 500 caracteres"),
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);
    const { estado, observaciones } = req.body;

    await db.execute("UPDATE turnos SET estado=?, observaciones=? WHERE id=?", [
      estado,
      observaciones,
      id,
    ]);

    res.json({ success: true, message: "Turno actualizado correctamente" });
  }
);

router.delete(
  "/:id",
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);

    await db.execute("DELETE FROM turnos WHERE id=?", [id]);
    res.json({ success: true, data: id });
  }
);

export default router;