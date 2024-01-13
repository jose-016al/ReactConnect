const { conection } = require("./database/conection");
const express = require("express");
const cors = require("cors");

/* Libreria para acceder a ficheros estaticos */
/* const path = require('path'); */

/* Conexion a bbdd */
conection();

/* Crear servidor node */
const app = express();
const puerto = 3900;

/* Configurar cors */
app.use(cors());

/* Convertir los datos del body a objetos js */
app.use(express.json()); // recibir datos con content-type app/json
app.use(express.urlencoded({extended: true})); // form-urlencoded

/* Cargar conf rutas */
const UserRoutes = require("./routes/user");
const FollowRoutes = require("./routes/follow");
const PublicationRoutes = require("./routes/publication");


/* Cargar rutas */
/* app.use('/', express.static('dist', {redirect: false})); */
app.use("/api/user", UserRoutes);
app.use("/api/follow", FollowRoutes);
app.use("/api/publication", PublicationRoutes);

/* Cargar el index del frontend */
/* app.get('*', (req, res, next) => {
    return res.sendFile(path.resolve('dist/index.html'));
}); */

/* Poner servidor a escuchar peticiones http */
app.listen(puerto, () => {
    console.log("Servidor corriendo en el puerto: " + puerto);
});