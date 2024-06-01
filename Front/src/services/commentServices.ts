import axios from "~/utility/Axios/NestjsAPI";

function getAllComment(id: any, idUser: any) {
    return axios.get<any, any>(`/comment/${id}/${idUser}`);
}
function createComment(createCommentDto: any) {
    return axios.post<any, any>(`/comment`, createCommentDto);
}
function toggleLikeComment(createLikeCommentDto: any) {
    return axios.post<any, any>(`/like-comment`, createLikeCommentDto);
}

function deleteComment(id: any) {
    return axios.delete<any,any>(`/comment/${id}`);
}
function editComment(editCommentDto: any) {
    return axios.patch(`/comment/edit`, editCommentDto);
}
function createComInCom(createComInComDto: any) {
    return axios.post<any, any>(`/comincom`, createComInComDto);
}
function deleteComInCom(id: any) {
    console.log(id);
    return axios.delete<any, any>(`/comincom/${id}`);
}
export default {
    getAllComment,
    createComment,
    toggleLikeComment,
    deleteComment,
    editComment,
    createComInCom,
    deleteComInCom,
};
