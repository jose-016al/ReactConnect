const mongoose = require("mongoose");

const conection = async() => {

    try {
        /* await mongoose.connect("mongodb://localhost:27017/mi_redsocial"); */
        await mongoose.connect("mongodb+srv://jose_016al:BXgh5cNa8JlgTc57@cluster1.secyv2u.mongodb.net/mi_redsocial?retryWrites=true&w=majority",);
        /* Parametros dentro de objeto, solo en caso de aviso */
        /* useNewUrlParser: true */
        /* useUnifiedTopology: true */
        /* useCreateIndex: true */
        console.log("Conexion establecida");
    } catch (error) {
        console.log(error);
        throw new Error("No se ha podido conectar a la base de datos");
    }

}

module.exports = {
    conection
}