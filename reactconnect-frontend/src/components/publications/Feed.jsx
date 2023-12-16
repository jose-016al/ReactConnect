import { useEffect, useState } from 'react';
import avatar from '../../assets/img/user.png';
import { useAuth } from '../../hooks/useAuth';
import { PublicationList } from './PublicationList';
import { Petition } from '../../helpers/Petition';
import { Global } from '../../helpers/Global';
import { NewPublication } from './NewPublication';

export const Feed = () => {

    const { auth } = useAuth();
    const [publications, setPublications] = useState([]);
    const [page, setPage] = useState(1);
    const [more, setMore] = useState(true);

    useEffect(() => {
        getPublications(1, false);
    }, []);

    const getPublications = async (nextPage = 1, showNews = false) => {
        if (showNews) {
            setPublications([]);
            setPage(1);
            nextPage = 1
        }
        
        const token = localStorage.getItem('token');
        const { data } = await Petition(`${Global.url}publication/feed/${nextPage}`, "GET", undefined, false, token);
        if (data.status == "success") {
            let newPublications = data.publications;
            if (!showNews && publications.length >= 1) {
                newPublications = [...publications, ...data.publications];
            }
            setPublications(newPublications);
        }

        /* Paginacion */
        if (!showNews && publications.length >= (data.total - data.publications.length)) {
            setMore(false);
        }

        if (data.pages <= 1) {
            setMore(false);
        }
    }

    return (
        <>
            <NewPublication />

            <div className="content__header">
                <h1 className="content__title">Timeline</h1>
                <button className="content__button" onClick={() => getPublications(1, true)}>Mostrar nuevas</button>
            </div>

            <PublicationList
                publications={publications}
                getPublications={getPublications}
                page={page}
                setPage={setPage}
                more={more}
                setMore={setMore}
            />
            <br />
        </>
    )
}
