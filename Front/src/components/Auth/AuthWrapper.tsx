"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useDispatch, useSelector } from "react-redux";
import authServices from "~/services/authServices";
import { handleHoldDataUserRedux, handleRefreshRedux } from "~/redux/actions/authAction";
function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useDispatch<any>();
  const [loading, setLoading] = useState(false);
  const auth = useSelector<any>((state) => state.auth.auth);
  useEffect(() => {
    async function fetchData() {
      if (auth === false) {
        const res = await authServices.handleCheckToken();
        // if (res.data.ban.includes("ACCOUNT")) {
        //   dispatch(handleRefreshRedux(true));
        //   dispatch(handleHoldDataUserRedux(res.data));
        //   router.push(`/${res.data.slug}`);
        // }
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
      setLoading(true);
    }
    fetchData();

  }, []);

  return (
    <>
      {
        loading ?
          <> {children}</>
          :
          <></>
      }
    </>
  )
}

export default AuthWrapper;
