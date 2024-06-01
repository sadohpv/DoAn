"use client";
import Link from "next/link";
import classNames from "classnames/bind";
import styles from "./styles/Navbar.module.scss";
import {
  HomeIcon,
  LogoIcon,

} from "~/assets/icon";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import NotifyComp from "./NotifyComps/NotifyComp";
import SearchComp from "./SearchComps/SearchComp";
import CreateComp from "./CreateComps/CreateComp";
import MoreNavComp from "./MoreNavComps/MoreNavComp";
import { useWindowSize } from "usehooks-ts";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";
import { IRootState } from "~/redux/reducers/rootReducer";

const cx = classNames.bind(styles);

function Navbar() {

  const [page, setPage] = useState<number>(0);
  const [modal, setModal] = useState<boolean>(false);
  const [tippy, setTippy] = useState<boolean | null>(false);
  const [navLast, setNavLast] = useState<boolean | null>(true);
  const { width = 0, height = 0 } = useWindowSize();
  const pathname = usePathname();


  const ban = useSelector<IRootState, any>(state => state.auth.data.ban);
  const handleNavigate = () => {
    if (page !== 0) {
      setPage(0);
    }
    if (modal == true) {
      // console.log("Here");
      setModal(false);
    }
  };
  useEffect(() => {
    if (width < 768) {
      setNavLast(false);
      setTippy(true);
    } else if (width < 1260) {
      setTippy(false);
    } else {
      setTippy(null);
    }
    if (width >= 768) {
      setNavLast(true);
    }


  }, []);
  useEffect(() => {
    if (width < 768) {
      setTippy(true);
    } else if (width < 1260) {
      setNavLast(true);

      setTippy(false);
    } else {
      setNavLast(true);

      setTippy(null);
    }
    if (width > 768) {
      setNavLast(true);
    } else {
      setNavLast(false);
    }
  }, [width]);
  return (
    <div className={cx("navbar", modal && "short", ban.includes("ACCOUNT") && "ban_account")}>
      <div className={cx("nav_first")}>
        <Link href={"/"} onClick={handleNavigate}>
          <div className={cx("logo")}>
            <div className={cx("logo_icon")}>
              <LogoIcon />
            </div>
            <div className={cx("logo_title")}>
              <span>ZOOI</span>
            </div>
          </div>
        </Link>
        <div className={cx("nav_box")}>
          <Link
            className={cx("nav_item", page === 0 && pathname === "/" && "disable")}
            href={"/"}
            onClick={handleNavigate}
          >
            <div className={cx("icon")}>
              {page === 0 && pathname === "/" && (
                <HomeIcon fill={"var(--text-color)"} />
              )}
              {(page !== 0 || pathname !== "/") && <HomeIcon />}
            </div>
            <span>
              <FormattedMessage id="Navbar.home" />
            </span>
          </Link>

          <SearchComp
            page={page}
            setPage={setPage}
            setModal={setModal}
            modal={modal}
            tippy={tippy}
          />

          <NotifyComp
            page={page}
            setPage={setPage}
            setModal={setModal}
            modal={modal}
            tippy={tippy}
          />
          {
            !ban.includes("POST") &&
            <CreateComp
              page={page}
              setPage={setPage}
              setModal={setModal}
              modal={modal}
              tippy={tippy}
            />
          }
        </div>
      </div>
      {navLast === true && (
        <div className={cx("nav_last")}>
          <MoreNavComp tippy={tippy} modal={modal} position="top" />
        </div>
      )}
    </div>
  );
}

export default Navbar;
