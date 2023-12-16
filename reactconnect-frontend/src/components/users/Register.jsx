import { useState } from "react";
import { Global } from "../../helpers/Global";
import { Petition } from "../../helpers/Petition";
import { useForm } from "../../hooks/useForm"
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
    name: Yup.string()
        .required("El nombre es obligatorio"),
    surname: Yup.string()
        .required("Los apellidos son obligatorios"),
    nick: Yup.string()
        .required("El nick es obligatorio"),
    email: Yup.string()
        .email("El correo electrónico no es válido")
        .required("El correo electrónico es obligatorio"),
    password: Yup.string()
        .min(6, "La contraseña debe tener al menos 6 caracteres")
        .required("La contraseña es obligatoria"),
});

export const Register = () => {

    const [saved, setSaved] = useState("not_sended");

    const formik = useFormik({
        initialValues: {
            name: "",
            surname: "",
            nick: "",
            email: "",
            password: ""
        },
        validationSchema,
        onSubmit: values => {
            saveUser(values);
        }
    });

    const saveUser = async (form) => {
        let newUser = form;
        const { data } = await Petition(`${Global.url}user/register`, "POST", newUser);
        if (data.status === "success") {
            setSaved("saved");
        } else {
            setSaved("error");
        }
    }


    return (
        <>
            <div className="login-background">
                {saved == "saved" ? <strong className="alert alert-success">Usuario registrado correctamente</strong> : ""}
                {saved == "error" ? <strong className="alert alert-danger">El usuario no se ha registrado</strong> : ""}

                <div className="login-title">
                    <span>REGISTRO</span>
                </div>

                <form className="login-form" onSubmit={formik.handleSubmit}>
                    <div className="form-group">
                        <input type="text" name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange} 
                            placeholder="&nbsp;" />
                        <label htmlFor="name">Nombre</label>
                    </div>
                    <div className="error">
                        <p>
                            {formik.errors.name && formik.touched.name ? formik.errors.name : ""}
                        </p>
                    </div>
                    <div className="form-group">
                        <input type="text" name="surname"
                            value={formik.values.surname}
                            onChange={formik.handleChange} 
                            placeholder="&nbsp;" />
                        <label htmlFor="surname">Apellidos</label>
                    </div>
                    <div className="error">
                        {formik.errors.surname && formik.touched.surname ? formik.errors.surname : ""}
                    </div>
                    <div className="form-group">
                        <input type="text" name="nick"
                            value={formik.values.nick}
                            onChange={formik.handleChange}
                            placeholder="&nbsp;" />
                        <label htmlFor="nick">Nick</label>
                    </div>
                    <div className="error">
                        {formik.errors.nick && formik.touched.nick ? formik.errors.nick : ""}
                    </div>
                    <div className="form-group">
                        <input type="email" name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            placeholder="&nbsp;" />
                        <label htmlFor="email">Correo electronico</label>
                    </div>
                    <div className="error">
                        {formik.errors.email && formik.touched.email ? formik.errors.email : ""}
                    </div>
                    <div className="form-group">
                        <input type="password" name="password"
                            value={formik.values.password}
                            onChange={formik.handleChange} 
                            placeholder="&nbsp;" />
                        <label htmlFor="password">Contraseña</label>
                    </div>
                    <div className="error">
                        {formik.errors.password && formik.touched.password ? formik.errors.password : ""}
                    </div>
                    <div className="form-group button">
                        <Link to="/login">Login</Link>
                        <input type="submit" value="Registrarse" />
                    </div>
                </form>
            </div>
        </>
    )
}
