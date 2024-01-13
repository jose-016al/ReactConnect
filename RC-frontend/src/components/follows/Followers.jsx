import { useEffect, useState } from 'react';
import { Global } from '../../helpers/Global';
import { Petition } from '../../helpers/Petition';
import { ListUser } from '../users/ListUser';
import { useParams } from 'react-router-dom';
import { GetProfile } from '../../helpers/GetProfile';


export const Followers = () => {

    const {userid} = useParams();
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [more, setMore] = useState(true);
    const [following, setFollowing] = useState({});
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState({});

    useEffect(() => {
        getUsers(1);
        GetProfile(userid, setProfile);
    }, []);

    const getUsers = async (nextPage = 1) => {
        setLoading(true);
        /* Peticion para sacar usuarios */
        const token = localStorage.getItem('token');
        const { data } = await Petition(`${Global.url}follow/followers/${userid}/${nextPage}`, "GET", undefined, false, token);
        /* Recorrer y limpiar follows para quedarse con followed */
        let clearUsers = [];
        data.follows.forEach(follow => {
            clearUsers = [...clearUsers, follow.user];
        });
        data.users = clearUsers
         /* Crear un estado para poder listarlos */
        if (data.users && data.status === "success") {
            let newUsers = data.users;
            if (users.length >= 1) {
                newUsers = [...users, ...data.users];
            }
            setUsers(newUsers);
            setFollowing(data.user_following);
            setLoading(false);
        }

        /* Paginacion */
        if (users.length >= (data.total - data.users.length)) {
            setMore(false);
        }
    }

    return (
        <>
            <div className="content-title">
                <h1>Seguidores de {profile.name}</h1>
            </div>

            <ListUser
                users={users}
                getUsers={getUsers}
                following={following}
                setFollowing={setFollowing}
                page={page}
                setPage={setPage}
                loading={loading}
                more={more}
            />
            <br />
        </>
    )
}
