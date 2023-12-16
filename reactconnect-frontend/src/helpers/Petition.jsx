export const Petition = async (url, method, dataSave = "", file = false, token = "") => {

    let loading = true;

    let options = {
        method: "GET"
    }
    if (method == "GET" || method == "DELETE") {
        options = {
            method: method,
        }
        if (token) {
            options = {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                }
            }   
        }
    }
    if (method == "POST" || method == "PUT") {
        if (file) {
            options = {
                method: method,
                body: dataSave
            }
            if (token) {
                options = {
                    method: method,
                    body: dataSave,
                    headers: {
                        "Authorization": token
                    }
                }   
            }
        } else {
            options = {
                method: method,
                body: JSON.stringify(dataSave),
                headers: {
                    "Content-Type": "application/json"
                }
            }
            if (token) {
                options = {
                    method: method,
                    body: JSON.stringify(dataSave),
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token
                    }
                }   
            }
        }
    }
    const peticion = await fetch(url, options);
    const data = await peticion.json();

    loading = false;

    return {
        data,
        loading
    }
}