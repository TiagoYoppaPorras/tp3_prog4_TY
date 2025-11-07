import express from "express";
import { db } from "./db.js";
import { validarId, verificarValidaciones } from "./validaciones.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const [rows] = await db.execute("SELECT * FROM medicos");

  res.json({
    success: true,
    medicos: rows
  });
});

router.get(
  "/:id",
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);
    const [rows] = await db.execute(
      "SELECT nombre, apellido, especialidad, matricula_profesional FROM medicos WHERE id=?",
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
        matricula_profesional 
      }
    });
  }
);

router.delete(
  "/:id",
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);

    await db.execute("DELETE FROM medicos WHERE id=?", [id]);
    res.json({ success: true, data: id });
  }
);

export default router;