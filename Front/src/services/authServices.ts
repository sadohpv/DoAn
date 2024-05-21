import axios from "~/utility/Axios/NestjsAPI";

interface RegisterData {
    userName: string;
    email: string;
    password: string;
    phoneNumber: string;
    address: string;
    gender: boolean;
}
interface LoginData {
    account: string;
    password: string;
    type: boolean;
}
interface ResponseRegister {
    result: {
        EC: number;
        MS: string;
    };
}
interface ResponseLogin {
    result?: {
        EC: number;
        MS: string;
        access_token: string;
    };
    status: number;
    data?: {
        EC: number;
        MS: string;
    };
}

function handleRegister(
    account: string,
    password: string,
    phone: string,
    username: string,
    address: string,
    gender: boolean
) {
    const data: RegisterData = {
        userName: username,
        email: account,
        password: password,
        phoneNumber: phone,
        address: address,
        gender: gender,
    };

    return axios.post<ResponseRegister, ResponseRegister>(`/auth/register`, data);
}
function handleLogin(account: string, password: string, type: boolean) {
    const data: LoginData = {
        account: account,
        password: password,
        type: type,
    };

    return axios.post<ResponseLogin, ResponseLogin>(`/auth/login`, data);
}
interface ResponseTokenData {
    result: any;
    EC: number;
    data: any;
}
function handleCheckToken() {
    return axios.get<ResponseTokenData, ResponseTokenData>(`/auth/checkToken`);
}
function handleLogout() {
    return axios.get<ResponseTokenData, ResponseTokenData>(`/auth/logout`);
}
export default {
    handleRegister,
    handleLogin,
    handleCheckToken,
    handleLogout,
};
