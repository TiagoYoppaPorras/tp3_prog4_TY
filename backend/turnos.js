import express from "express";
import { db } from "./db.js";
import { validarId, verificarValidaciones } from "./validaciones.js";

const router = express.Router();

// Obtener todos los turnos
router.get("/", async (req, res) => {
  const [rows] = await db.execute(`
    SELECT 
      t.id,
      p.nombre AS paciente_nombre,
      m.nombre AS medico_nombre,
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
    turnos: rows
  });
});

// Obtener un turno por ID
router.get(
  "/:id",
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);
    const [rows] = await db.execute(`
      SELECT 
        t.id,
        p.nombre AS paciente_nombre,
        m.nombre AS medico_nombre,
        t.fecha,
        t.hora,
        t.estado,
        t.observaciones
      FROM turnos t
      JOIN pacientes p ON t.paciente_id = p.id
      JOIN medicos m ON t.medico_id = m.id
      WHERE t.id = ?
    `, [id]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Turno no encontrado" });
    }

    res.json({ success: true, turno: rows[0] });
  }
);

// Crear un nuevo turno
router.post(
  "/",
  verificarValidaciones,
  async (req, res) => {
    const { paciente_id, medico_id, fecha, hora, estado, observaciones } = req.body;

    const [result] = await db.execute(
      "INSERT INTO turnos (paciente_id, medico_id, fecha, hora, estado, observaciones) VALUES (?,?,?,?,?,?)",
      [paciente_id, medico_id, fecha, hora, estado, observaciones]
    );

    res.status(201).json({
      success: true,
      data: { id: result.insertId, paciente_id, medico_id, fecha, hora, estado, observaciones }
    });
  }
);

// Actualizar estado u observaciones de un turno
router.put(
  "/:id",
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);
    const { estado, observaciones } = req.body;

    await db.execute(
      "UPDATE turnos SET estado=?, observaciones=? WHERE id=?",
      [estado, observaciones, id]
    );

    res.json({ success: true, message: "Turno actualizado correctamente" });
  }
);

// Eliminar un turno
router.delete(
  "/:id",
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);

    await db.execute("DELETE FROM turnos WHERE id=?", [id]);
    res.json({ success: true, data: id });
  }
);

export default router;