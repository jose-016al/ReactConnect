import avatar from '../../assets/img/user.png';
import { Global } from '../../helpers/Global';
import { Link } from 'react-router-dom';
import { Petition } from '../../helpers/Petition';
import { useAuth } from '../../hooks/useAuth';
import ReactTimeAgo from 'react-time-ago';

export const PublicationList = ({ publications, getPublications, page, setPage, more, setMore }) => {

    const { auth } = useAuth();

    const nextPage = () => {
        let next = page + 1;
        setPage(next);
        getPublications(next);
    }

    const deletePublication = async (id) => {
        const token = localStorage.getItem('token');
        const { data } = await Petition(`${Global.url}publication/remove/${id}`, "DELETE", undefined, false, token);
        if (data.status === 'success') {
            /* setPublications(publications.filter(pub => pub._id != id)); */
            getPublications(1, true);
            setPage(1);
            setMore(true);
        }
    }

    return (
        <>
            {publications.map(publication => {
                return (
                    <article key={publication._id}>
                        <div>
                            <div className="image-user">
                                <Link to={`/social/profile/${publication.user._id}`}>
                                    {publication.user.image != "default.png" && <img src={`${Global.url}user/avatar/${publication.user.image}`} className="post__user-image" alt="Foto de perfil" />}
                                    {publication.user.image == "default.png" && <img src={avatar} className="post__user-image" alt="Foto de perfil" />}
                                </Link>
                            </div>
                            <div className="post-user">
                                <div>
                                    <Link to={`/social/profile/${publication.user._id}`}>{publication.user.name} {publication.user.surname}</Link>
                                    <span> | </span>
                                    <Link to={`/social/profile/${publication.user._id}`}>
                                        <ReactTimeAgo date={new Date(publication.created_at).getTime()} locale="es-ES" />
                                    </Link>
                                </div>
                                <div>
                                    <h4>{publication.text}</h4>

                                    {publication.file &&
                                        <img src={`${Global.url}publication/media/${publication.file}`} alt='Foto de la publicacion' />
                                    }
                                </div>
                            </div>
                            {publication.user._id === auth._id &&
                                <div className="people-buttons">
                                    <button onClick={() => deletePublication(publication._id)} className="unfollow">
                                        <i className="fa-solid fa-trash-can"></i>
                                    </button>
                                </div>
                            }
                        </div>
                    </article>
                );
            })}

            {
                more &&
                <div className="button-more">
                    <button onClick={nextPage}>
                        Ver mas publicaciones
                    </button>
                </div>
            }
        </>
    )
}
