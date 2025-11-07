import express from 'express'
import pacientesRouter from "./pacientes.js";
import usuariosRouter from "./usuarios.js";
import { conectarDB } from './db.js'

conectarDB()

const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
    res.send('Bienvenidos a mi api en el puerto 3000')
})

app.use(express.json())
app.use("/pacientes", pacientesRouter);
app.use("/usuarios", usuariosRouter);


app.listen(port ,() => {
    console.log(`Aplicación funcionando en http://localhost:${port}`);
})