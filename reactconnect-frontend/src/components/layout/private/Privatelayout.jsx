import { Header } from './Header'
import { Navigate, Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { useAuth } from '../../../hooks/useAuth'

export const Privatelayout = () => {

    const { auth, loading } = useAuth();

    if (loading) {
        return <h1>Cargando</h1>
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
