export const serializeForm = (form) => {
    const formData = new FormData(form);

    const completeObj = {};

    for (let [name, value] of formData) {
        completeObj[name] = value;
    }
    return completeObj;
}