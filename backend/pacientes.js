import express from "express";
import { db } from "./db.js";
import { validarId, verificarValidaciones } from "./validaciones.js";

const router = express.Router();

// Obtener todos los pacientes
router.get("/", async (req, res) => {
  const [rows] = await db.execute("SELECT * FROM pacientes");

  res.json({
    success: true,
    pacientes: rows
  });
});

// Obtener un paciente por ID
router.get(
  "/:id",
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);
    const [rows] = await db.execute(
      "SELECT nombre, apellido, dni, fecha_nacimiento, obra_social FROM pacientes WHERE id=?",
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

// Crear paciente
router.post(
  "/",
  verificarValidaciones,
  async (req, res) => {
    const { nombre, apellido, dni, fecha_nacimiento, obra_social } = req.body;

    const [result] = await db.execute(
      "INSERT INTO pacientes (nombre, apellido, dni, fecha_nacimiento, obra_social) VALUES (?,?,?,?,?)",
      [nombre, apellido, dni, fecha_nacimiento, obra_social]
    );

    res.status(201).json({
      success: true,
      data: { id: result.insertId, nombre, apellido, dni }
    });
  }
);

router.put(
  "/:id",
  validarId,
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

// Eliminar paciente
router.delete(
  "/:id",
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);

    await db.execute("DELETE FROM pacientes WHERE id=?", [id]);
    res.json({ success: true, data: id });
  }
);

export default router;
