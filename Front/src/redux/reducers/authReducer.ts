import { LOGIN, REFRESH, HOLD_DATA_OWNER } from "../actions/authAction";
interface AuthState {
    auth: boolean | null | string;
    token: string | null;
    data: any;
}

const INITIAL_STATE: AuthState = {
    auth: false,
    token: null,
    data: {},
};

const authReducer = (state: AuthState = INITIAL_STATE, action: any) => {
    switch (action.type) {
        case LOGIN:
            sessionStorage.setItem("auth", action.data.auth);
            return {
                ...state,
            };
        case REFRESH:
            sessionStorage.setItem("auth", action.data.auth);

            return {
                ...state,
                auth: action.data.auth,
            };

        case HOLD_DATA_OWNER:
     
            return {
                ...state,
                data: action.data,
            };
        default:
            return state;
    }
};
export default authReducer;
