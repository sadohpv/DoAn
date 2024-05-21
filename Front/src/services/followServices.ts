import axios from "~/utility/Axios/NestjsAPI";

function handleCallApiFollow(followData: any) {
    return axios.post<any, any>(`/follow`, followData);
}

export default {
    handleCallApiFollow,
};
