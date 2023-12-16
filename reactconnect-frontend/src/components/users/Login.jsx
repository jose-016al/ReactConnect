import { useState } from "react";
import { Global } from "../../helpers/Global";
import { Petition } from "../../helpers/Petition";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email("El correo electrónico no es válido")
        .required("El correo electrónico es obligatorio"),
    password: Yup.string().required("La contraseña es obligatoria")
});

export const Login = () => {

    const [saved, setSaved] = useState("not_sended");
    const { setAuth } = useAuth();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema,
        onSubmit: values => {
            loginUser(values)
        }
    });

    const loginUser = async (form) => {
        let user = form;
        const { data } = await Petition(`${Global.url}user/login`, "POST", user);
        if (data.status === "success") {
            /* Persistir datos en localStorage */
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            setSaved("login");
            /* Setear datos en el auth */
            setAuth(data.user);
            /* Redirrecion */
            window.location.reload();
        } else {
            setSaved("error");
        }
    }

    return (
        <>
            <div className="login-background">
                {saved == "login" ? <strong className="alert alert-success">Se ha identificado</strong> : ""}
                {saved == "error" ? <strong className="alert alert-danger">El usuario o la contraseña son incorrecta</strong> : ""}
                <div className="login-title">
                    <span>LOGIN</span>
                </div>

                <form className="login-form" id="login" onSubmit={formik.handleSubmit}>
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
                        <Link to="/register">Registro</Link>
                        <input type="submit" value="Identificate" />
                    </div>
                </form>
            </div>
        </>
    )
}
