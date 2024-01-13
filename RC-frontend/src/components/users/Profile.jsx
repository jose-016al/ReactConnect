import { useEffect, useState } from 'react';
import avatar from '../../assets/img/user.png';
import { GetProfile } from '../../helpers/GetProfile';
import { Link, useParams } from 'react-router-dom';
import { Global } from '../../helpers/Global';
import { Petition } from '../../helpers/Petition';
import { useAuth } from '../../hooks/useAuth';
import { PublicationList } from '../publications/PublicationList';

export const Profile = () => {

    const { auth } = useAuth();
    const { userid } = useParams();
    const [profile, setProfile] = useState({});
    const [iFollow, setIFollow] = useState(false);
    const [counters, setCounters] = useState({});
    const [publications, setPublications] = useState([]);
    const [page, setPage] = useState(1);
    const [more, setMore] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDataUser();
        getCounter();
        getPublications(1, true);
    }, []);

    useEffect(() => {
        getDataUser();
        getCounter();
        setMore(true);
        getPublications(1, true);
    }, [userid]);

    useEffect(() => {
        getDataUser();
        getCounter();
        getPublications(1, true);
    }, [counters]);

    const getDataUser = async () => {
        let dataUser = await GetProfile(userid, setProfile);
        if (dataUser.following && dataUser.following._id) setIFollow(true);
    }

    const getCounter = async () => {
        const token = localStorage.getItem('token');
        const { data } = await Petition(`${Global.url}user/counters/${userid}`, "GET", undefined, false, token);
        setCounters(data);
    }

    const follow = async (id) => {
        /* Peticion al backend para guardar el follow */
        const token = localStorage.getItem('token');
        const { data } = await Petition(`${Global.url}follow/save`, "POST", { followed: id }, false, token);

        if (data.status === 'success') {
            setIFollow(true);
        }
    }

    const unfollow = async (id) => {
        /* Peticion al backend para guardar el unfollow */
        const token = localStorage.getItem('token');
        const { data } = await Petition(`${Global.url}follow/unfollow/${id}`, "DELETE", undefined, false, token);

        if (data.status === 'success') {
            setIFollow(false);
        }
    }

    const getPublications = async (nextPage = 1, newProfile = false) => {
        const token = localStorage.getItem('token');
        const { data } = await Petition(`${Global.url}publication/user/${userid}/${nextPage}`, "GET", undefined, false, token);
        if (data.status == "success") {
            let newPublications = data.publications;
            if (!newProfile && publications.length >= 1) {
                newPublications = [...publications, ...data.publications];
            }
            if (newProfile) {
                newPublications = data.publications;
                setMore(true);
                setPage(1);
            }
            setPublications(newPublications);
            setLoading(false);
        }

        /* Paginacion */
        if (!newProfile && publications.length >= (data.total - data.publications.length)) {
            setMore(false);
        }

        if (data.pages <= 1) {
            setMore(false);
        }
    }

    return (
        <>
            <div className='profile'>
                <div className="profile-info">
                    <div className="profile-info-image-user">
                        {profile.image != "default.png" && <img src={`${Global.url}user/avatar/${profile.image}`} alt="Foto de perfil" />}
                        {profile.image == "default.png" && <img src={avatar} alt="Foto de perfil" />}
                    </div>
                    <div className="profile-info-name-user">
                        <div className='people-buttons'>
                            {auth._id != userid &&
                                (iFollow ?
                                    <button onClick={() => unfollow(userid)} className="unfollow">Dejar de seguir</button>
                                    : <button onClick={() => follow(userid)}>Seguir</button>
                                )}
                        </div>
                        <div>
                            <h1>{profile.name} {profile.surname}</h1>
                            <h2>{profile.nick}</h2>
                            <p>{profile.bio}</p>
                        </div>
                    </div>
                </div>
                <div className="profile-info-stats">
                    <div>
                        <Link to={`/social/following/${userid}`}>
                            <span>Siguiendo</span>
                            <span>{counters.following}</span>
                        </Link>
                    </div>
                    <div>
                        <Link to={`/social/followers/${userid}`}>
                            <span>Seguidores</span>
                            <span>{counters.followed}</span>
                        </Link>
                    </div>
                    <div>
                        <Link to={`/social/profile/${userid}`}>
                            <span>Publicaciones</span>
                            <span>{counters.publications}</span>
                        </Link>
                    </div>
                </div>
            </div>

            <PublicationList
                publications={publications}
                getPublications={getPublications}
                page={page}
                setPage={setPage}
                more={more}
                setMore={setMore}
                loading={loading}
            />
            <br />
        </>
    )
}
