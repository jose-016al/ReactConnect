import React, { useState } from 'react'
import { Petition } from '../../helpers/Petition';
import { Global } from '../../helpers/Global';
import { useForm } from '../../hooks/useForm';

export const NewPublication = () => {

    const { form, changed } = useForm({});
    const [saved, setSaved] = useState("not_sended");

    const savePublication = async (e) => {
        e.preventDefault();
        const myForm = document.querySelector("#publication-form");
        /* Recoger datos del formulario */
        let publication = form;
        const token = localStorage.getItem("token");
        const { data } = await Petition(`${Global.url}publication/save`, "POST", publication, false, token);
        if (data.status === "success") {
            setSaved("saved");
        } else {
            setSaved("error");
        }

        /* Subir imagen */
        const fileInput = document.querySelector("#file");
        if (data.status === "success" && fileInput.files[0]) {
            const formData = new FormData();
            formData.append("file0", fileInput.files[0]);
            const upload = await Petition(`${Global.url}publication/upload/${data.publication._id}`, "POST", formData, true, token);
            if (upload.data.status === "success") {
                setSaved("saved");
                myForm.reset();
            } else {
                setSaved("error");
            }
        }

        if (data.status == "success") {
            myForm.reset();
        }
    }

    return (
        <div className="new-publication">
            {saved == "saved" ? <strong className="alert alert-success">Post publicado</strong> : ""}
            {saved == "error" ? <strong className="alert alert-danger">No se ha podido publicar el post</strong> : ""}
            <form id='publication-form' onSubmit={savePublication}>
                <div>
                    <textarea name="text" onChange={changed} placeholder="&nbsp;" />
                    <label htmlFor="text">¿Que estas pesando hoy?</label>
                </div>
                <div>
                    <div className="form-post__inputs">
                        <input type="file" name="file0" id='file' className="form-post__image" />
                    </div>

                    <div className='button-more'>
                        <input type="submit" value="Enviar" />
                    </div>
                </div>
            </form>
        </div>
    )
}
