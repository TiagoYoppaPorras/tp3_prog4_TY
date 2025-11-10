import express from 'express';
import cors from "cors";
import passport from "passport";
import { conectarDB } from './db.js'
import usuariosRouter from "./usuarios.js";
import pacientesRouter from "./pacientes.js"
import medicosRouter from "./medicos.js";
import turnosRouter from "./turnos.js";
import authRouter, { authConfig } from "./auth.js"; 


conectarDB()

const app = express()
const port = process.env.PORT

app.use(express.json())

app.use(cors());

app.use(passport.initialize());

authConfig();

app.get('/', (req, res) => {
    res.send('Hola mundo')
})

app.use("/usuarios", usuariosRouter);
app.use("/pacientes", pacientesRouter);
app.use("/medicos", medicosRouter);
app.use("/turnos", turnosRouter);
app.use("/auth", authRouter);



app.listen(port ,() => {
    console.log(`Funcionando en http://localhost:${port}`);
})