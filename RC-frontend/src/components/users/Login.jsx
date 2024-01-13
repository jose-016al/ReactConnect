import { useState } from "react";
import { Global } from "../../helpers/Global";
import { Petition } from "../../helpers/Petition";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email("El correo electrónico no es válido")
        .required("El correo electrónico es obligatorio"),
    password: Yup.string().required("La contraseña es obligatoria")
});

export const Login = () => {

    const [saved, setSaved] = useState("not_sended");
    const { setAuth, loading } = useAuth();
    const navigate = useNavigate();

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
            location.reload();
            /* navigate("/social"); */
        } else {
            setSaved("error");
        }
    }

    // Reset saved state after 10 seconds
    setTimeout(() => {
        setSaved("not_sended");
    }, 16000);

    return (
        <>
            {saved == "login" ? <strong className="alert alert-success">Se ha identificado</strong> : ""}
            {saved == "error" ? <strong className="alert alert-danger">El usuario o la contraseña son incorrecta</strong> : ""}
            <div className="login-background">
                <div className="login-title">
                    <span>LOGIN</span>
                </div>

                {loading ? (
                    <div className='custom-loader-container-login'>
                        <div className="custom-loader-login"></div>
                    </div>
                ) : (
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
                )}
            </div>
        </>
    )
}
