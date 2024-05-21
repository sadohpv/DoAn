const LOGIN: string = "LOGIN";
const REFRESH: string = "REFRESH";
const HOLD_DATA_OWNER: string = "HOLD_DATA_OWNER";
export { LOGIN, REFRESH, HOLD_DATA_OWNER };

export const handleLoginRedux = (auth: boolean, token: string) => {
  return async (dispatch: any, getState: any) => {
    dispatch({
      type: LOGIN,
      data: {
        auth,
        token,
      },
    });
  };
};

export const handleRefreshRedux = (auth: boolean) => {
  return async (dispatch: any, getState: any) => {
    dispatch({
      type: REFRESH,
      data: {
        auth,
      },
    });
  };
};

export const handleHoldDataUserRedux = (data: any) => {
  return async (dispatch: any, getState: any) => {
    dispatch({
      type: HOLD_DATA_OWNER,
      data,
    });
  };
};
