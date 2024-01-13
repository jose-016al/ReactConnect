import React, { useEffect, useState } from 'react';
import { createContext } from "react";
import { Global } from '../helpers/Global';
import { Petition } from '../helpers/Petition';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [auth, setAuth] = useState({});
    const [counters, setCounters] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        authUser();
    }, []);

    useEffect(() => {
        authUser();
    }, [counters]);

    const authUser = async () => {
        /* Sacar datos del usuario identificado del localStorage */
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        /* Comprobar si tengo el token y el user */
        if (!token || !user) {
            false;
            setLoading(false);
        } else {

            /* Transformar los datos a un objeto de javsscript */
            const userObjt = JSON.parse(user);
            const userId = userObjt.id;
    
            /* Peticion ajaz al backend que compruebe el token y que me devuleva todos los datos del usuario */
    
            const request = await Petition(`${Global.url}user/profile/${userId}`, "GET", undefined, false, token);
    
            const data = await request.data;
    
            const requestCounters = await Petition(`${Global.url}user/counters/${userId}`, "GET", undefined, false, token);
    
            const dataCounters = await requestCounters.data;
    
            /* Setear el estado de auth */
            setAuth(data.user);
            setCounters(dataCounters);
            setLoading(false);
        }
    }

    return (
        <AuthContext.Provider value={{ auth, setAuth, counters, setCounters, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;