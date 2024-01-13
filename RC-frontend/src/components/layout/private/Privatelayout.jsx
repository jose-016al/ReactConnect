import { Header } from './Header'
import { Navigate, Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { useAuth } from '../../../hooks/useAuth'

export const Privatelayout = () => {

    const { auth, loading } = useAuth();

    if (loading) {
        return <div className='custom-loader-container'><div className="custom-loader"></div></div>
    } else {
        return (
            <div className='layout'>
                {/* LAYOUT */}
                <Header />
                {/* Barra lateral */}
                <Sidebar />
                {/* Contenido principal */}
                <section>
                    {auth._id ? <Outlet /> : <Navigate to="/login" />}
                </section>
            </div>
        )
    }

}
