"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useDispatch, useSelector } from "react-redux";
import authServices from "~/services/authServices";
import { handleHoldDataUserRedux, handleRefreshRedux } from "~/redux/actions/authAction";
function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useDispatch<any>();

  const auth = useSelector<any>((state) => state.auth.auth);
  useEffect(() => {
    async function fetchData() {
      if (auth === false) {
        const res = await authServices.handleCheckToken();
        if (typeof res == "number") {
          
        } else {
          if (res.EC === 0) {
            sessionStorage.setItem("auth", "true");
         
            dispatch(handleRefreshRedux(true));
            dispatch(handleHoldDataUserRedux(res.data));
          
          } else {
            sessionStorage.removeItem("auth");
            router.push("/login");
          }
        }
      }
    }
    fetchData();

  }, []);

  return <>{children}</>;
}

export default AuthWrapper;
