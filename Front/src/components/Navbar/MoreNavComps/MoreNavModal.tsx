import Link from "next/link";
import classNames from "classnames/bind";
import styles from "./MoreNavComp.module.scss";

import { FC, useState } from "react";
import TooltipCustom from "~/utility/Tippy/TooltipCustom";
import { FormattedMessage } from "react-intl";
import { AdminIcon, LanguageIcon, LogoutIcon, MoonIcon, SaveFillIcon, WriteIcon } from "~/assets/icon";
import TippyCustom from "~/utility/Tippy/TooltipCustom";
import { useDispatch, useSelector } from "react-redux";
import {
  changeLanguageRedux,
  changeThemeRedux,
} from "~/redux/actions/appAction";
import { LANGUAGE, THEME } from "~/utility/constants/constants";
import authServices from "~/services/authServices";
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { IRootState } from "~/redux/reducers/rootReducer";
import Avatar from "~/components/Avatar/Avatar";
const cx = classNames.bind(styles);
interface MoreNavModalProps { }

const MoreNavModal: FC<MoreNavModalProps> = ({ }) => {
  const router = useRouter();
  const language = useSelector((state: any) => state.app.language);
  const theme = useSelector((state: any) => state.app.theme);
  const slug = useSelector<IRootState, any>(state => state.auth.data.slug);
  const avatar = useSelector<IRootState, any>(state => state.auth.data.avatar);
  const name = useSelector<IRootState, any>(state => state.auth.data.userName);
  const role = useSelector<IRootState, any>(state => state.auth.data.role);


  const dispatch = useDispatch<any>();
  const handleToggleLanguage = () => {
    if (language === LANGUAGE.VI) {
      dispatch(changeLanguageRedux(LANGUAGE.EN));
    }
    if (language === LANGUAGE.EN) {
      dispatch(changeLanguageRedux(LANGUAGE.VI));
    }
  };
  const handleToggleTheme = () => {
    if (theme === THEME.DARK) {
      dispatch(changeThemeRedux(THEME.LIGHT));
    }
    if (theme === THEME.LIGHT) {
      dispatch(changeThemeRedux(THEME.DARK));
    }
  };
  const handleLogout = async () => {
    console.log("Here");
    const result = await authServices.handleLogout();
    console.log(result);
    Cookies.remove("accessToken");
    window.location.replace('/login');
  }
  return (
    <div className={cx("modal_wrapper")}>
      <div className={cx("funtion")}>

        <Link href={`/settings`} className={cx("more_item")} >
          <div className={cx("more_icon")}>
            <WriteIcon />
          </div>
          <div className={cx("more_title")}>
            <FormattedMessage id="Navbar.setting" />
          </div>
        </Link>
        <TippyCustom content={<FormattedMessage id="Navbar.language" />}>
          <div className={cx("more_item")} onClick={handleToggleLanguage}>
            <div className={cx("more_icon")}>
              <LanguageIcon />
            </div>
            <div className={cx("more_title", "language_button")}>
              <div
                className={cx(
                  "language",
                  language === LANGUAGE.EN && "lang_active"
                )}
              >
                <span>English</span>
              </div>
              <div
                className={cx(
                  "language",
                  language === LANGUAGE.VI && "lang_active"
                )}
              >
                <span>Tiếng Việt</span>
              </div>
            </div>
          </div>
        </TippyCustom>
        <TippyCustom content={<FormattedMessage id="Navbar.Theme" />}>
          <div className={cx("more_item")} onClick={handleToggleTheme}>
            <div className={cx("more_icon")}>
              {theme === THEME.DARK && <MoonIcon />}
              {theme === THEME.LIGHT && <MoonIcon />}
            </div>
            <div className={cx("more_title", "language_button")}>
              <div
                className={cx("language", theme === THEME.DARK && "lang_active")}
              >
                <span>
                  <FormattedMessage id="Navbar.Dark" />
                </span>
              </div>
              <div
                className={cx("language", theme === THEME.LIGHT && "lang_active")}
              >
                <span>
                  <FormattedMessage id="Navbar.Light" />
                </span>
              </div>
            </div>
          </div>
        </TippyCustom>
        <Link href={`/${slug}/save`} className={cx("more_item")}>

          <div className={cx("more_icon")}>
            <SaveFillIcon width="20px" height="20px" />
          </div>
          <div className={cx("more_title")}>
            <FormattedMessage id="Common.Save_post" />
          </div>
        </Link>

      </div>

      <div className={cx("funtion")}>

        <div className={cx("more_item")} onClick={handleLogout}>

          <div className={cx("more_icon")}>
            <LogoutIcon />
          </div>
          <div className={cx("more_title")}>
            <FormattedMessage id="Navbar.logout" />
          </div>
        </div>
        {
          role === 'ADMIN' &&
          <Link href={`/admin`} className={cx("more_item")}>

            <div className={cx("more_icon")}>
              <AdminIcon />
            </div>
            <div className={cx("more_title")}>
              <FormattedMessage id="Common.Management" />

            </div>
          </Link>
        }
        <Link href={`/${slug}`} className={cx("more_item")}>

          <div className={cx("more_icon")}>
            <Avatar size={32} disableLink src={avatar} />
          </div>
          <div className={cx("more_title")}>
            {name}
          </div>
        </Link>
      </div>

    </div>
  );
};

export default MoreNavModal;
