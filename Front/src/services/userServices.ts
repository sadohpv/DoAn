import axios from "~/utility/Axios/NestjsAPI";

function getSuggestedFriend(id: number) {
    return axios.get<any, any>(`/users/suggested/${id}`);
}

function getDataForUserPage(slug: string, id: number) {
    return axios.get<any, any>(`/users/userPage/${slug}/${id}`);
}
function handleSearchUser(keyword: any, idUser: any) {
    return axios.get<any, any>(`/users/search/${idUser}/${keyword}`);
}

function getDataForSetting(idUser: any) {
    return axios.get<any, any>(`/users/${idUser}`);
}
function patchDataUser(updateUserDto: any, idUser: any) {
    return axios.patch<any, any>(`/users/${idUser}`, updateUserDto);
}
function changePassword(updatePasswordUserDto: any) {
    return axios.patch<any, any>(`/users/password`, updatePasswordUserDto);
}
function changeAvatar(updateAvatarUserDto: any) {
    return axios.patch<any, any>(`/users/avatar`, updateAvatarUserDto);
}
export default {
    getSuggestedFriend,
    getDataForUserPage,
    handleSearchUser,
    getDataForSetting,
    patchDataUser,
    changePassword,
    changeAvatar,
};
