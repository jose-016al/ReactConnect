import { Global } from "./Global";
import { Petition } from "./Petition";

export const GetProfile = async(userid, setState) => {

    const token = localStorage.getItem('token');
    const { data } = await Petition(`${Global.url}user/profile/${userid}`, "GET", undefined, false, token);
    if (data.status === 'success') {
        setState(data.user);
    } 
    return data;
}
