import axios from "~/utility/Axios/NestjsAPI";

function handleSavePost(savePost: any) {
    return axios.post<any, any>(`/save-post/save`, savePost);
}
function handeUnsavePost(savePost: any) {
    return axios.post<any, any>(`/save-post/unsave`, savePost);
}
export default {
    handleSavePost,
    handeUnsavePost,
};
