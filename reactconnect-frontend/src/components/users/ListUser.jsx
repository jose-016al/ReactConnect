import { Link } from 'react-router-dom';
import avatar from '../../assets/img/user.png';
import { Global } from '../../helpers/Global';
import { Petition } from '../../helpers/Petition';
import { useAuth } from '../../hooks/useAuth';
import ReactTimeAgo from 'react-time-ago';

export const ListUser = ({ users, getUsers, following, setFollowing, page, setPage, loading, more }) => {

    const { auth } = useAuth();

    const nextPage = () => {
        let next = page + 1;
        setPage(next);
        getUsers(next);
    }

    const follow = async (id) => {
        /* Peticion al backend para guardar el follow */
        const token = localStorage.getItem('token');
        const { data } = await Petition(`${Global.url}follow/save`, "POST", { followed: id }, false, token);

        if (data.status === 'success') {
            setFollowing([...following, id]);
        }
    }

    const unfollow = async (id) => {
        /* Peticion al backend para guardar el unfollow */
        const token = localStorage.getItem('token');
        const { data } = await Petition(`${Global.url}follow/unfollow/${id}`, "DELETE", undefined, false, token);

        if (data.status === 'success') {
            setFollowing(following.filter(followingUserId => id != followingUserId));
        }
    }

    return (
        <>
            <div className="content__posts">
                {loading ? "Cargando..." : ""}

                {users.map(user => {
                    return (
                        <article key={user._id}>
                            <div className='people'>
                                <div className="image-people">
                                    <Link to={`/social/profile/${user._id}`}>
                                        {user.image != "default.png" && <img src={`${Global.url}user/avatar/${user.image}`} alt="Foto de perfil" />}
                                        {user.image == "default.png" && <img src={avatar} alt="Foto de perfil" />}
                                    </Link>
                                </div>
                                <div className="post-user">
                                    <div>
                                        <Link to={`/social/profile/${user._id}`}>{user.name} {user.surname}</Link>
                                        <span> | </span>
                                        <Link to={`/social/profile/${user._id}`}>
                                            <ReactTimeAgo date={new Date(user.created_at).getTime()} locale="es-ES" />
                                        </Link>
                                    </div>
                                    <div>
                                        <h4>{user.bio}</h4>
                                    </div>
                                </div>
                                {user._id !== auth._id &&
                                    <div className="people-buttons">
                                        {!following.includes(user._id) &&
                                            <button onClick={() => follow(user._id)}>
                                                Seguir
                                            </button>
                                        }
                                        {following.includes(user._id) &&
                                            <button onClick={() => unfollow(user._id)} className="unfollow">
                                                Dejar de Seguir
                                            </button>
                                        }
                                    </div>
                                }
                            </div>
                        </article>
                    );
                })}
            </div>

            {more &&
                <div className="button-more">
                    <button onClick={nextPage}>
                        Ver mas personas
                    </button>
                </div>
            }
            <br />
        </>
    )
}
