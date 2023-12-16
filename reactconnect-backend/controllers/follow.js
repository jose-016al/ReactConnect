/* Importar modelo */
const Follow = require("../models/Follow");
const User = require("../models/User");
/* Importar servicio */
const followService = require("../services/followService");
/* Importar dependencias */
const mongoosePagination = require("mongoose-pagination");

/* Accion de guardar un follow (accion seguir) */
const save = async (req, res) => {
    try {
        /* Conseguir datos por body */
        const params = req.body;

        /* Sacar id del usuario identificador */
        const identify = req.user;

        /* Crear objeto con modelo follow */
        let userToFolloe = new Follow({
            user: identify.id,
            followed: params.followed
        });

        /* Guardar objeto en bbdd */
        const follow = await userToFolloe.save();

        if (!follow) {
            return res.status(500).json({
                status: 'error',
                message: "No se ha podido seguir al usuario",
            });
        }

        return res.status(200).json({
            status: 'success',
            identify,
            userToFolloe
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: "Error en el servidor" });
    }
}

/* Accion de borrar un follow (accion dejar de seguir */
const unfollow = async (req, res) => {
    try {
        /* Recoger el id del usuario identificado */
        const userId = req.user.id;

        /* Recoger el id del usuario que sigo y quiero dejar de seguir */
        const followedId = req.params.id;

        /* Find de las coincidencias y hacer remove */
        const unfollow = await Follow.findOneAndRemove({
            user: userId,
            followed: followedId
        }).exec();
        
        if (!unfollow) {
            return res.status(400).json({ status: 'error', message: "No se ha podido dejar de seguir al usuario" });
        }

        return res.status(200).json({
            status: 'success',
            message: "Usuario unfollow"
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: "Error en el servidor" });
    }
}

/* Accion Listado de uusarios que cualquier usuario esta siguiendo */
const following = async (req, res) => {
    try {
        /* Sacar el id del usuario identifiado */
        let userId = req.user.id;

        /* Comprobar si me llega el id por parametro en url */
        if (req.params.id) userId = req.params.id;

        /* Comprobar si me llega la pagina, si no le pagina 1 */
        let page = 1
        if (req.params.page) page = parseInt(req.params.page);

        /* Usuarios por pagina quiero mostrar */
        const itemPerPage = 5;
        /* Find a follow, popular datos de los usuarios y paginar con mongoose pagination */
        const follows = await Follow.find({ user: userId })
            .populate("user followed", "-password -role -__v -email")
            .skip((page - 1) * itemPerPage)
            .limit(itemPerPage)
            .exec();

        const total = await Follow.countDocuments({ user: userId });

        /* Sacar un array de ids de los usuarios que me siguen y los que sigo como usuario */
        let followUserIds = await followService.followUserIds(req.user.id);

        return res.status(200).json({
            status: 'success',
            message: "Listado de usuarios que estoy siguiendo",
            follows,
            total,
            page: Math.ceil(total / itemPerPage),
            user_following: followUserIds.following,
            user_follow_me: followUserIds.followers
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: "Error en el servidor" });
    }
}

/* Accion Listado de usuarios que siguen a cualquier otro usuario */
const followers = async(req, res) => {
    try {

        /* Sacar el id del usuario identifiado */
        let userId = req.user.id;

        /* Comprobar si me llega el id por parametro en url */
        if (req.params.id) userId = req.params.id;

        /* Comprobar si me llega la pagina, si no le pagina 1 */
        let page = 1
        if (req.params.page) page = parseInt(req.params.page);

        const total = await Follow.countDocuments({ followed: userId });

        /* Usuarios por pagina quiero mostrar */
        const itemPerPage = 5;
        /* Find a follow, popular datos de los usuarios y paginar con mongoose pagination */
        const follows = await Follow.find({ followed: userId })
            .populate("user", "-password -role -__v -email")
            .skip((page - 1) * itemPerPage)
            .limit(itemPerPage)
            .exec();

        /* Sacar un array de ids de los usuarios que me siguen y los que sigo como usuario */
        let followUserIds = await followService.followUserIds(req.user.id);

        return res.status(200).json({
            status: 'success',
            message: "Listado de usuarios que me siguen",
            follows,
            total,
            page: Math.ceil(total / itemPerPage),
            user_following: followUserIds.following,
            user_follow_me: followUserIds.followers
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: "Error en el servidor" });
    }
}

/* Exportar acciones */
module.exports = {
    save,
    unfollow,
    following,
    followers
}