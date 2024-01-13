import { useEffect, useState } from 'react';
import { Global } from '../../helpers/Global';
import { Petition } from '../../helpers/Petition';
import { ListUser } from './ListUser';

export const People = () => {

    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [more, setMore] = useState(true);
    const [following, setFollowing] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUsers(1);
    }, []);

    const getUsers = async (nextPage = 1) => {
        setLoading(true);
        /* Peticion para sacar usuarios */
        const token = localStorage.getItem('token');
        const { data } = await Petition(`${Global.url}user/get-users/${nextPage}`, "GET", undefined, false, token);

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
                <h1>Usuarios</h1>
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
