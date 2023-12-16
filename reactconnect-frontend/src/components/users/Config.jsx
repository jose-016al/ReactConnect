import { useState } from 'react'
import avatar from '../../assets/img/user.png';
import { useAuth } from '../../hooks/useAuth';
import { Petition } from '../../helpers/Petition';
import { Global } from '../../helpers/Global';
import { serializeForm } from '../../helpers/SerializeForm';

export const Config = () => {

    const { auth, setAuth } = useAuth();
    const [saved, setSaved] = useState("not_sended");

    const updateUser = async (e) => {
        e.preventDefault();
        let user = serializeForm(e.target);
        delete user.file0;
        const token = localStorage.getItem('token');
        const { data } = await Petition(`${Global.url}user/update`, "PUT", user, false, token);

        if (data.status === "success") {
            delete data.user.pawssword
            const updatedUser = { ...auth, ...data.user };
            setAuth(updatedUser);
            setSaved("saved");
            /* window.location.reload(); */
        } else {
            setSaved("error");
        }

        /* Subir imagen */
        const fileInput = document.querySelector("#file");
        if (data.status === "success" && fileInput.files[0]) {
            const formData = new FormData();
            formData.append("file0", fileInput.files[0]);
            const upload = await Petition(`${Global.url}user/upload`, "POST", formData, true, token);
            if (upload.data.status === "success") {
                delete upload.data.user.password;
                const updatedUser = { ...auth, image: upload.data.user.image };
                setAuth(updatedUser);
                setSaved("saved");
            } else {
                setSaved("error");
            }
        }
    }

    return (
        <>
            <div className="content-title">
                <h1>Ajustes</h1>
            </div>

            <div>
                {saved == "saved" ? <strong className="alert alert-success">El usuario se ha actualizado correctamente</strong> : ""}
                {saved == "error" ? <strong className="alert alert-danger">No se ha podido actualizar el usuario</strong> : ""}
                <form className='config-form' onSubmit={updateUser}>
                    <div className='config-form-container'>
                        <div>
                            <div className="form-group-config">
                                <input type="text" name="name" defaultValue={auth.name} placeholder="&nbsp;" />
                                <label htmlFor="name">Nombre</label>
                            </div>
                            <div className="form-group-config">
                                <input type="text" name="surname" defaultValue={auth.surname} placeholder="&nbsp;" />
                                <label htmlFor="surname">Apellidos</label>
                            </div>
                            <div className="form-group-config">
                                <input type="text" name="nick" defaultValue={auth.nick} placeholder="&nbsp;" />
                                <label htmlFor="nick">Nick</label>
                            </div>
                        </div>
                        <div>
                            <div className="form-group-config">
                                <textarea type="text" name="bio" defaultValue={auth.bio} placeholder="&nbsp;" />
                                <label htmlFor="bio">Biografia</label>
                            </div>
                            <div className="form-group-config">
                                <input type="email" name="email" defaultValue={auth.email} placeholder="&nbsp;" />
                                <label htmlFor="email">Correo electronico</label>
                            </div>
                            <div className="form-group-config">
                                <input type="password" name="password" placeholder="&nbsp;" />
                                <label htmlFor="password">Contraseña</label>
                            </div>
                        </div>
                    </div>
                    <div className="image-container">
                        <div>
                            <label htmlFor="file0">imagen de perfil</label>
                            <div className="general-info__container-avatar">
                                {auth.image != "default.png" && <img src={`${Global.url}user/avatar/${auth.image}`} className="container-avatar__img" alt="Foto de perfil" />}
                                {auth.image == "default.png" && <img src={avatar} className="container-avatar__img" alt="Foto de perfil" />}
                            </div>
                        </div>
                        <input type="file" name="file0" id='file' />
                    </div>
                    
                    <div className="button-more">
                        <input type="submit" value="Actualizar" />
                    </div>
                </form>
            </div>
        </>
    )
}
