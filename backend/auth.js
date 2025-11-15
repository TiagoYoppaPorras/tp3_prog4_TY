import express from "express";
import { db } from "./db.js";
import { verificarValidaciones } from "./validaciones.js";
import { body } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";

const router = express.Router();

export function authConfig() {
  // Opciones de configuracion de passport-jwt
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  };

  // Creo estrategia jwt
  passport.use(
    new Strategy(jwtOptions, async (payload, next) => {
      try {
        const [usuarios] = await db.execute(
          "SELECT id, nombre, email FROM usuarios WHERE id=?",
          [payload.userId]
        );

        if (usuarios.length === 0) {
          return next(null, false);
        }

        next(null, { ...payload, usuario: usuarios[0] });
      } catch (error) {
        next(error, false);
      }
    })
  );
}

export const verificarAutenticacion = passport.authenticate("jwt", {
  session: false,
});

router.post(
  "/login",
  body("email", "Email inválido")
    .isEmail()
    .withMessage("Debe ser un email válido"),
  body("password", "Contraseña inválida").isStrongPassword({
    minLength: 8, // Minimo de 8 caracteres
    minLowercase: 1, // Al menos una letra en minusculas
    minUppercase: 1, // Letras mayusculas opcionales
    minNumbers: 1, // Al menos un número
    minSymbols: 1, // Símbolos opcionales
  }),
  verificarValidaciones,
  async (req, res) => {
    const { email, password } = req.body;

    const [usuarios] = await db.execute(
      "SELECT * FROM usuarios WHERE email=?",
      [email]
    );

    if (usuarios.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "Usuario o contraseña inválidos" });
    }

    // Verificar la contraseña
    const hashedPassword = usuarios[0].hash_contraseña;

    const passwordComparada = await bcrypt.compare(password, hashedPassword);

    if (!passwordComparada) {
      return res
        .status(400)
        .json({ success: false, error: "Usuario o contraseña inválidos" });
    }

    // Generar jwt
    const payload = {
      userId: usuarios[0].id,
      userEmail: usuarios[0].email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "4h",
    });

    // Devolver jwt y datos del usuario
    res.json({
      success: true,
      token,
      user: {
        id: usuarios[0].id,
        nombre: usuarios[0].nombre,
        email: usuarios[0].email,
      },
    });
  }
);

export default router;