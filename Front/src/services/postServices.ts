import axios from "~/utility/Axios/NestjsAPI";

function handleCreatePost(createPostDto: any) {
    return axios.post(`/post`, createPostDto);
}
function getAllPost(id: any) {
    return axios.get<any, any>(`/post/${id}`);
}

function handleToggleLikePost(likePostDto: any) {
    return axios.post(`/like-post`, likePostDto);
}
function handleGetGuestPost(slug: string, id: number) {
    return axios.get<any, any>(`/post/guest/${slug}/${id}`);
}

function handleGetListLikePost(id: number, idUser: number) {
    return axios.get<any, any>(`/post/listLike/${id}/${idUser}`);
}
function getPostPage(page: number, idUser: number) {
    return axios.get<any, any>(`/post/page/${page}/${idUser}`);
}
function getPostById(idPost: number, idUser: number) {
    return axios.get<any, any>(`/post/one/${idPost}/${idUser}`);
}
function changePublished(changePublishedDto: any) {
    return axios.post<any, any>(`/post/published`, changePublishedDto);
}
function handleDeletePost(id: number) {
    return axios.delete<any, any>(`/post/${id}`);
}
function getAllPostSetting(id: number) {
    return axios.get<any, any>(`/post/all/${id}`);
}
function handleUpdatePost(updatePostDto: any) {
    return axios.patch<any, any>(`/post/`, updatePostDto);
}
function handleGetSavePost(slug: string, id: number) {
    return axios.get<any, any>(`/post/save/${slug}/${id}`);
}
export default {
    handleCreatePost,
    getAllPost,
    handleToggleLikePost,
    handleGetGuestPost,
    handleGetListLikePost,
    getPostPage,
    getPostById,
    changePublished,
    handleDeletePost,
    getAllPostSetting,
    handleUpdatePost,
    handleGetSavePost,
};
