import axios from "~/utility/Axios/NestjsAPI";

function handleGetAllNotify(id: any) {
    return axios.get<any, any>(`/notify/${id}`);
}
function handleReadNotify(id: any) {
    return axios.get<any, any>(`/notify/read/${id}`);
}
export default {
    handleGetAllNotify,
    handleReadNotify
};
