import { Link } from 'react-router-dom';
import avatar from '../../../assets/img/user.png';
import { Global } from '../../../helpers/Global';
import { useAuth } from '../../../hooks/useAuth';
import { NewPublication } from '../../publications/NewPublication';

export const Sidebar = () => {

    const { auth, counters } = useAuth();

    return (
        <aside>
            <div>
                <div className="profile-info" id="profile-info-aside">
                    <div className="profile-info-image">
                        {auth.image != "default.png" && <img src={`${Global.url}user/avatar/${auth.image}`} alt="Foto de perfil" />}
                        {auth.image == "default.png" && <img src={avatar} alt="Foto de perfil" />}
                    </div>

                    <div className="profile-info-name">
                        <Link to={`/social/profile/${auth._id}`}>{auth.name} {auth.surname}</Link>
                        <p>{auth.nick}</p>
                    </div>
                </div>

                <div className="profile-info-stats" id='profile-info-stats-aside'>
                    <div>
                        <Link to={`/social/following/${auth._id}`}>
                            <span>Siguiendo</span>
                            <span>{counters.following}</span>
                        </Link>
                    </div>
                    <div>
                        <Link to={`/social/followers/${auth._id}`}>
                            <span>Seguidores</span>
                            <span>{counters.followed}</span>
                        </Link>
                    </div>
                    <div>
                        <Link to={`/social/profile/${auth._id}`}>
                            <span>Publicaciones</span>
                            <span>{counters.publications}</span>
                        </Link>
                    </div>
                </div>
            </div>

            <NewPublication />
        </aside>
    )
}
