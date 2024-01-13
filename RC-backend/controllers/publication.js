/* Importar modelo */
const Publication = require("../models/Publication");
/* Importar dependencias */
const fs = require('fs');
const path = require('path');
const mongoosePagination = require("mongoose-pagination");
/* Importar servicios */
const followService = require("../services/followService");

/* Guardar publicacion */
const save = async (req, res) => {
    try {
        /* Recoger datos del body */
        const params = req.body;

        /* Si no me llegan dar respuesta negativa */
        if (!params.text) return res.status(400).json({ status: "erroor", message: "Debes enviar el texto de la publicacion" });

        /* Crear y rellenar el objeto del modelo */
        let publication = new Publication(params);
        publication.user = req.user.id;

        /* Guardar objeto en bbdd */
        const newPublication = await publication.save();

        if (!newPublication) {
            return res.status(400).json({ status: "erroor", message: "No se ha podido guardar la publicacion en la bbdd" });
        }

        /* Devolver respuesta */
        return res.status(200).json({
            status: 'success',
            message: "Publicacion guardada",
            publication: newPublication
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: "Error en el servidor" });
    }
}

/* Sacar una publicacion */
const show = async (req, res) => {
    try {
        /* Sacar id de publiacion de la url */
        const id = req.params.id;

        /* Find con la condicion del id */
        const publication = await Publication.findById(id).exec();

        if (!publication) {
            return res.status(404).json({ status: 'error', message: "No se ha encontrado la publicacion" });
        }

        /* Devolver respuesta */
        return res.status(200).json({
            status: 'success',
            publication
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: "Error en el servidor" });
    }
}

/* Eliminar publicaciones */
const remove = async (req, res) => {
    try {
        /* Sacar el id de la publicacion a eliminar */
        const id = req.params.id;

        /* Find y luego un remove */
        const publication = await Publication.findOneAndRemove({
            user: req.user.id,
            _id: id
        }).exec();

        if (!publication) {
            return res.status(404).json({ status: 'error', message: "No se ha encontrado la publicacion" });
        }

        /* Devolver respuesta */
        return res.status(200).json({
            status: 'success',
            message: "Publicacion eliminada",
            publication: id
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: "Error en el servidor" });
    }
}

/* Listar publicaciones de un usuario */
const user = async (req, res) => {
    try {
        /* Sacar el id del usuario */
        const userId = req.params.id
    
        /* Controlar la pagina */
        let page = 1
        if (req.params.page) page = parseInt(req.params.page);
        const total = await Publication.countDocuments({ "user": userId });
    
        /* Find, pupulate, ordenar, paginar */
        const itemPerPage = 5;
    
        const publications = await Publication.find({ user: userId })
            .populate("user", "-password -role -__v")
            .sort("-created_at")
            .skip((page - 1) * itemPerPage)
            .limit(itemPerPage)
            .exec();
    
        
    
        /* Devolver respuesta */
        return res.status(200).json({
            status: 'success',
            message: "Publicaciones del usuario",
            page,
            total,
            pages: Math.ceil(total / itemPerPage),
            publications
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: "Error en el servidor" });
    }
}

/* Subir ficheros */
const upload = async (req, res) => {
    try {
        /* Sacar publicacion id */
        const id = req.params.id;

        /* Recoger fichero de iamgen y comprobar que existe */
        if (!req.file) {
            return res.status(404).json({ status: "error", message: "Peticion no incluye la imagen" });
        }

        /* Conseguir el nombre del archivo */
        let file = req.file.originalname;

        /* Sacar la extension del archivo */
        const file_split = file.split("\.");
        const extension = file_split[1];

        /* Comprobar extension */
        if (extension != "png" && extension != "jpg" && extension != "jpeg" && extension != "gif") {
            /* Borrar archivo y dar respuesta */
            const fileDelete = fs.unlinkSync(req.file.path);
            return res.status(400).json({ status: "error", message: "Extension de fichero invalida" });
        }
        /* Si si es correcta, guardar imagen en bbdd */
        const publication = await Publication.findOneAndUpdate({ user: req.user.id, _id: id }, { file: req.file.filename }, { new: true }).exec();

        /* Si no existe, devolver un error */
        if (!publication) {
            return res.status(500).json({
                status: "error", message: "Error en la subida de la imagen"
            });
        }

        /* Devolver respuesta */
        return res.status(200).send({
            status: "success",
            publication,
            filtes: req.files
        });
    } catch (error) {
        return res.status(500).json({ status: "error", message: "Error en el servidor" });
    }
}

/* Devolver archivos multimedia imagenes */
const media = (req, res) => {
    try {
        let file = req.params.file;
        let url = "./uploads/publications/" + file;
        fs.stat(url, (error, exist) => {
            if (!exist) return res.status(404).json({ status: "error", mensaje: "No existe la iamgen" });

            return res.sendFile(path.resolve(url));
        })
    } catch (error) {
        return res.status(500).json({ status: "error", message: "Error en el servidor" });
    }
}

/* Listar todas las publicaciones (FEED) */
const feed = async (req, res) => {
    try {
        /* sacar la pagina actual */
        let page = 1;
        if (req.params.page) page = parseInt(req.params.page);

        /* Establecer numero de elementos por pagina */
        let itemsPerPage = 5;
        const total = await Publication.countDocuments({ user: req.user.id });

        /* Sacar un array de identificadores de usuarios que yo sigo como usuario logueado */
        const myFollows = await followService.followUserIds(req.user.id);

        /* Find a publicaciones in, ordenar, pupular,  */
        const publications = await Publication.find({ user: myFollows.following })
            .populate("user", "-password -role -__v -email")
            .sort("-created_at")
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage)
            .exec();

        if (!publications) {
            return res.status(500).json({ status: 'error', message: "No hay publicaciones" });
        }

        return res.status(200).json({
            status: 'success',
            message: "Feed de publicaciones",
            following: myFollows.following,
            total,
            page,
            pages: Math.ceil(total / itemsPerPage),
            publications,
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: "Error en el servidor" });
    }
}

module.exports = {
    save,
    show,
    remove,
    user,
    upload,
    media,
    feed
}