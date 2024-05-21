"use client";
import React, { FC, useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "$app/auth/Login.module.scss";
import FallingStars from "~/components/Funny/FallingStars";
import { FormattedMessage } from "react-intl";
import Link from "next/link";
import TippyCustom from "~/utility/Tippy/TooltipCustom";
import Candle from "~/components/Funny/Candle";
import authServices from "~/services/authServices";
import { useDispatch, useSelector } from "react-redux";
import {
  handleHoldDataUserRedux,
  handleRefreshRedux,
} from "~/redux/actions/authAction";
import { useRouter } from "next/navigation";
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
const cx = classNames.bind(styles);

interface LoginPageProps { }

const LoginPage: FC<LoginPageProps> = () => {

  const [loginType, SetLoginType] = useState<boolean>(false);
  const [account, setAccount] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [notify, setNotify] = useState<string>(
    "I will tell you if something went wrong !"
  );
  const [color, setColor] = useState<string>("white");
  const [loading, setLoading] = useState<boolean>(false);
  const auth = useSelector<any>((state) => state.auth.auth);
  const dispatch = useDispatch<any>();

  const router = useRouter();

  const handleLogin = async () => {
    if (password === "" || account === "") {
      setColor("red");
      setNotify("Missing data!");
    } else {
      if (loginType === false) {
        let emailRegex = /^[a-zA-Z0-9._]+(@gmail.com)$/;

        if (emailRegex.test(account)) {
          setColor("yellow");
          setNotify("Processing...");
          const res = await authServices.handleLogin(
            account,
            password,
            loginType
          );

          if (res && typeof res != "number") {
            if (
              res.result !== undefined &&
              res.result.access_token !== undefined
            ) {
              setColor("green");
              setNotify("OK ! Let go");
              dispatch(handleRefreshRedux(true));
              window.location.replace('/');
            } else {
              if (res.data !== undefined) {
                setColor("red");

                setNotify(res.data.MS);
              }
            }
          } else {
            setColor("red");
            setNotify("Something wrong! Try again later");
          }
        } else {
          setColor("red");
          setNotify("Invalid email");
        }
      } else {
        let phoneRegex = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;

        if (phoneRegex.test(account)) {
          const res = await authServices.handleLogin(
            account,
            password,
            loginType
          );
          console.log(res);
        } else {
          setColor("red");
          setNotify("Invalid phone number");
        }
      }
    }
  };
  const handleSwitchAccountLogin = () => {
    SetLoginType(!loginType);
  };

  const handleChangeAccount = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.startsWith(" ") === false) {
      setAccount(e.target.value.trim());
    }
  };
  const handleChangeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      handleLogin();
    }
  };
  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.startsWith(" ") === false) {
      setPassword(e.target.value.trim());
    }
  };

  useEffect(() => {
    async function fetchData() {


      const res = await authServices.handleCheckToken();

      if (typeof res == "number") {
        setLoading(true);

      } else {
        if (res.EC === 0) {
          sessionStorage.setItem("auth", "true");
          dispatch(handleRefreshRedux(true));
          dispatch(handleHoldDataUserRedux(res.data));
          console.log("Here");
          window.location.replace('/');
        } else {
          setLoading(true);
        }
      }

    }
    fetchData();
  }, []);

  return (
    <>
      {loading ? (
        <div className={cx("wrapper")}>
          <div className={cx("falling_star")}>
            <FallingStars />
          </div>
          <div className={cx("title")}>
            <span>
              <FormattedMessage id="Login.Login" />
            </span>
          </div>
          <div className={cx("main")}>
            <div className={cx("input_box")}>
              <div className={cx("input_title")}>
                <div
                  className={cx("switch_login", loginType && "login_active")}
                  onClick={handleSwitchAccountLogin}
                >
                  <span>
                    <FormattedMessage id="Login.Email" />
                  </span>
                </div>
                <div
                  className={cx("switch_login", !loginType && "login_active")}
                  onClick={handleSwitchAccountLogin}
                >
                  <span>
                    <FormattedMessage id="Login.Phonenumber" />
                  </span>
                </div>
              </div>
              <input
                value={account}
                type="text"
                placeholder="Email"
                onChange={(e) => handleChangeAccount(e)}
                onKeyDown={(e) => handleChangeKeyDown(e)}
              />
            </div>
            <div className={cx("input_box")}>
              <div className={cx("input_title")}>
                <FormattedMessage id="Login.Password" />
              </div>
              <input
                value={password}
                type="password"
                onChange={(e) => handleChangePassword(e)}
                placeholder="Password"
                onKeyDown={(e) => handleChangeKeyDown(e)}
              />
            </div>
            <div className={cx("action")}>
              <div className={cx("login_button")} onClick={handleLogin}>
                <span>
                  <FormattedMessage id="Login.Login" />
                </span>
              </div>
              <div className={cx("link_sign")}>
                <span>If you don't have account please click | </span>
                <Link href="/register"> Register </Link>
              </div>
            </div>
          </div>
          <TippyCustom  content={notify}>
            <div className={cx("notify_box")}>
              <Candle color={color} />
            </div>
          </TippyCustom>
        </div>
      ) : (
        <div className={cx("wrapper")}></div>
      )}
      {/* <ToastContainer /> */}
    </>
  );
};

export default LoginPage;
