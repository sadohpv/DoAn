import axios from "~/utility/Axios/NestjsAPI";

function handleCreateReport(createReportDto: any) {
    return axios.post<any, any>(`/report`, createReportDto);
}

function handleGetReportPost(id: number) {
    return axios.get(`/report/post/${id}`);
}
function handleGetReportUser(id: number) {
    return axios.get<any, any>(`/report/user/${id}`);
}
function handleGetDataUserForAdmin() {
    return axios.get<any, any>(`/report/adminPage`);
}
function handleBanUser(createBan: any) {
    return axios.patch<any, any>(`/report/ban/user`, createBan);
}
function handleBanComment(createBan: any) {
    return axios.patch<any, any>(`/report/ban/comment`, createBan);
}
function handleBanPost(createBan: any) {
    return axios.patch<any, any>(`/report/ban/post`, createBan);
}
export default {
    handleCreateReport,
    handleGetReportPost,
    handleGetReportUser,
    handleGetDataUserForAdmin,
    handleBanUser,
    handleBanComment,
    handleBanPost,
};
