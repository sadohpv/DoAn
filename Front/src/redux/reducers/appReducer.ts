import { LANGUAGE, THEME } from "~/utility/constants/constants";
import { CHANGE_LANGUAE, CHANGE_THEME } from "../actions/appAction";

interface AppState {
  language: string;

  theme: string;
}

const INITIAL_STATE: AppState = {
  language: LANGUAGE.EN,

  theme: THEME.DARK,
};

const appReducer = (state: AppState = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case CHANGE_LANGUAE:
      localStorage.setItem("language", action.language);
      return {
        ...state,
        language: action.language,
      };
    case CHANGE_THEME:
      localStorage.setItem("theme", action.theme);
      return {
        ...state,
        theme: action.theme,
      };

    default:
      return state;
  }
};
export default appReducer;
