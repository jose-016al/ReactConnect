import { NavLink } from 'react-router-dom';
import avatar from '../../../assets/img/user.png';
import { useAuth } from '../../../hooks/useAuth';
import { Global } from '../../../helpers/Global';

export const Nav = () => {

    const { auth } = useAuth();

    return (
        <nav>
            

            <ul className='nav-right'>
                <li>
                    <NavLink to="/social">
                        <i className="fa-solid fa-house"></i>
                        <span>Inicio</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/social/feed">
                        <i className="fa-solid fa-list"></i>
                        <span>Timeline</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/social/people">
                        <i className="fa-solid fa-user"></i>
                        <span>Gente</span>
                    </NavLink>
                </li>
            </ul>

            <ul className='nav-left'>
                <li className='image-profile'>
                    <NavLink to={`/social/profile/${auth._id}`} className="list-end__link-image">
                        {auth.image != "default.png" && <img src={`${Global.url}user/avatar/${auth.image}`} alt="Imagen de perfil" />}
                        {auth.image == "default.png" && <img src={avatar} alt="Imagen de perfil" />}
                    </NavLink>
                </li>
                <li>
                    <NavLink to={`/social/profile/${auth._id}`}>
                        <span>{auth.nick}</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/social/settings">
                        <i className="fa-solid fa-gear"></i>
                        <span>Ajustes</span>
                    </NavLink>
                </li>
                <li className='nav-logout'>
                    <NavLink to="/social/logout">
                        <i className="fa-solid fa-arrow-right-from-bracket"></i>
                        <span>Cerrar sesión</span>
                    </NavLink>
                </li>
            </ul>

        </nav>
    )
}
