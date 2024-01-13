/* Importar dependencias y modulos */
const User = require("../models/User");
const Follow = require("../models/Follow");
const Publication = require("../models/Publication");
const bcrypt = require("bcrypt");
const fs = require('fs');
const path = require('path');

const mongoosePagination = require("mongoose-pagination");
/* Importar servicios */
const jwt = require("../services/jwt");
const followService = require("../services/followService");
const validate = require('../helpers/validate');

const register = async (req, res) => {
    /* Recoger datos de la peticion */
    let params = req.body;

    /* Comprobar que me llegen bien (+ validacion) */
    if (!params.name || !params.email || !params.password || !params.nick) {
        return res.status(400).json({ status: "error", message: "Faltan datos por enviar", });
    }
    
    /* Validacion avanzada */
    try {
        validate(params);
    } catch (error) {
        return res.status(400).json({ status: "error", message: "Validacion no superada", });
    }
    
    try {
        /* Control usuarios duplicados */
        const duplicateUser = await User.find({
            $or: [
                { email: params.email.toLowerCase() },
                { nick: params.nick.toLowerCase() },
            ]
        }).exec();

        if (duplicateUser && duplicateUser.length >= 1) {
            return res.status(200).send({ status: "error", message: "El usuario ya existe", });
        }
        /* Cifrar la contraseña */
        let pwd = await bcrypt.hash(params.password, 10);
        params.password = pwd;

        /* Crear objeto de uusario */
        let user_to_save = new User(params);

        /* Guardar usuario en la bbdd */
        const userStored = user_to_save.save();

        if (!userStored) {
            return res.status(500).send({ status: "error", message: "Error al guardar el usuario" });
        }

        /* Devolver resultado */
        return res.status(200).json({
            status: "success",
            message: "Usuario registrado",
            user: userStored
        });
    } catch (error) {
        return res.status(500).json({ status: "error", message: "Error en el servidor" });
    }
}

const login = async (req, res) => {
    try {
        /* Recoger parametros body */
        let params = req.body;

        if (!params.email || !params.password) {
            return res.status(400).send({ status: "error", message: "Faltan datos por enviar" });
        }

        /* Buscar en la bbdd si existe */
        const user = await User.findOne({ email: params.email }).exec();

        if (!user) {
            return res.status(404).send({ status: "error", message: "No existe el usuario" });
        }

        /* Comprobar su contraseña */
        const pwd = bcrypt.compareSync(params.password, user.password);

        if (!pwd) {
            return res.status(400).send({ status: "error", message: "Contraseña incorrecta" });
        }
        /* Devolver Token */
        const token = jwt.createToken(user);

        /* Devolver resultado */
        return res.status(200).send({
            status: "success",
            message: "Te has identificado correctamente",
            user: {
                id: user._id,
                name: user.name,
                nick: user.nick
            },
            token
        });
    } catch (error) {
        return res.status(500).json({ status: "error", message: "Error en el servidor" });
    }
}

const profile = async (req, res) => {
    try {
        /* Recibir el parametro del id de usuario por la url */
        const id = req.params.id;

        /* Consulta para sacar los datos del usuario */
        const user = await User.findById(id).select({ password: 0, role: 0 }).exec();

        if (!user) {
            return res.status(404).send({ status: "error", message: "El usuario no existe" });
        }

        /* Info de seguimiento */
        const followInfo = await followService.followThisUser(req.user.id, id);

        /* Devolver el resultado */
        return res.status(200).send({
            status: "success",
            user: user,
            following: followInfo.following,
            follower: followInfo.follower
        });
    } catch (error) {
        return res.status(500).json({ status: "error", message: "Error en el servidor" });
    }
}

const getUsers = async (req, res) => {
    try {
        /* Controlar en que pagina estamos */
        let page = 1;
        if (req.params.page) {
            page = parseInt(req.params.page);
        }

        /* Consulta con mongoose pagination */
        let itemPerPage = 5;

        const total = await User.countDocuments();

        // Calcular el número de páginas
        const totalPages = Math.ceil(total / itemPerPage);

        // Validar la página solicitada
        if (page < 1 || page > totalPages) {
            return res.status(404).json({ status: "error", message: "Página no encontrada", });
        }

        // Consultar la lista de usuarios paginados
        const users = await User.find()
            .select("-password -rolw -email -__v")
            .sort('_id')
            .skip((page - 1) * itemPerPage)
            .limit(itemPerPage)
            .exec();

        if (!users || users.length === 0) {
            return res.status(404).json({ status: "error", message: "No hay usuarios", });
        }

        /* Sacar un array de ids de los usuarios que me siguen y los que sigo como usuario */
        let followUserIds = await followService.followUserIds(req.user.id);

        /* Devolver el resultado */
        return res.status(200).send({
            status: "success",
            users,
            page,
            itemPerPage,
            total,
            totalPages,
            user_following: followUserIds.following,
            user_follow_me: followUserIds.followers
        });
    } catch (error) {
        return res.status(500).json({ status: "error", message: "Error en el servidor", });
    }
}

const update = async (req, res) => {
    try {
        /* Recoger info del usuario a actualizar */
        let userIdentity = req.user;
        let userToUpdate = req.body;

        /* Eliminar campos sobrrantes */
        delete userToUpdate.iat;
        delete userToUpdate.exp;
        delete userToUpdate.role;

        /* Comprobar si el usuario ya existe */
        const users = await User.find({
            $or: [
                { email: userToUpdate.email.toLowerCase() },
                { nick: userToUpdate.nick.toLowerCase() },
            ]
        }).exec();

        let userIsset = false;
        users.forEach(user => {
            if (user && user.id !== userIdentity.id) userIsset = true;
        });

        if (userIsset) {
            return res.status(200).send({ status: "success", message: "El usuario ya existe", });
        }

        /* Si me llega la passwd cifrarla */
        if (userToUpdate.password) {
            let pwd = await bcrypt.hash(userToUpdate.password, 10);
            userToUpdate.password = pwd;
        } else {
            delete userToUpdate.password;
        }

        /* Buscar y actualizar */
        const user = await User.findByIdAndUpdate(userIdentity.id, userToUpdate, { new: true }).exec();

        if (!userToUpdate) {
            return res.status(500).send({ status: "error", message: "Error, al actualizar usuario", });
        }

        return res.status(200).send({
            status: "success",
            message: "Usuario actualizado",
            user: userToUpdate
        });
    } catch (error) {
        return res.status(500).json({ status: "error", message: "Error en el servidor", });
    }
}

const upload = async (req, res) => {
    try {
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
        const user = await User.findOneAndUpdate({ _id: req.user.id }, { image: req.file.filename }, { new: true }).exec();

        /* Si no existe, devolver un error */
        if (!user) {
            return res.status(500).json({
                status: "error", message: "Error en la subida del avatar"
            });
        }

        /* Devolver respuesta */
        return res.status(200).send({
            status: "success",
            user: user,
            filtes: req.files
        });
    } catch (error) {
        return res.status(500).json({ status: "error", message: "Error en el servidor" });
    }
}

const avatar = (req, res) => {
    try {
        let file = req.params.file;
        let url = "./uploads/avatars/" + file;
        fs.stat(url, (error, exist) => {
            if (!exist) return res.status(404).json({ status: "error", mensaje: "No existe la iamgen" });

            return res.sendFile(path.resolve(url));
        })
    } catch (error) {
        return res.status(500).json({ status: "error", message: "Error en el servidor" });
    }
}

const counters = async(req, res) => {
    let userId = req.user.id

    if (req.params.id) userId = req.params.id;

    try {
        const following = await Follow.count({user: userId});
        const followed = await Follow.count({followed: userId});
        const publications = await Publication.count({user: userId});
        return res.status(200).send({
            userId,
            following: following,
            followed: followed,
            publications: publications
        });
    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Error en los contadores",
            error
        });
    }
}

module.exports = {
    register,
    login,
    profile,
    getUsers,
    update,
    upload,
    avatar,
    counters
}
