import axios from "~/utility/Axios/NestjsAPI";

function handleGetPostReport() {
    return axios.get<any,any>(`/admin/post`);
}
function handleGetCommentReport(){
    return axios.get<any,any>(`/admin/comment`);

}
export default {
    handleGetPostReport,
    handleGetCommentReport
};
