import { useAuth } from '../../../hooks/useAuth'
import { Navigate, Outlet } from 'react-router-dom'

export const PublicLayout = () => {

    const { auth } = useAuth();

    return (
        <div className='container__public'>
            {/* LAYOUT */}
            {/* Contenido principal */}
            <section className='login-field'>
                {/* <Nav /> */}
                {!auth._id ? <Outlet /> : <Navigate to="/social" />}
            </section>
            <span className="square square-tl"></span>
            <span className="square square-tr"></span>
            <span className="square square-bl"></span>
            <span className="square square-br"></span>
            <span className="star star1"></span>
            <span className="star star2"></span>
        </div>
    )
}
