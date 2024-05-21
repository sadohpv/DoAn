"use client";
import Link from "next/link";
import classNames from "classnames/bind";
import styles from "./styles/NavbarSearch.module.scss";
import {
  CreateIcon,
  HeartIcon,
  HomeIcon,
  LogoIcon,
  SearchIcon,
} from "~/assets/icon";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { useMediaQuery } from "usehooks-ts";
import MoreNavComp from "./MoreNavComps/MoreNavComp";

const cx = classNames.bind(styles);

function NavbarSearch() {
  const [page, setPage] = useState<number>(0);
  const [modal, setModal] = useState<boolean>(false);
  const [tippy, setTippy] = useState<boolean | null>(false);

  const matches = useMediaQuery("(max-width: 768px)");

  const router = usePathname();
  const openMoreNav = () => {
    setModal(!modal);
  };

  return (
    <>
      {matches && (
        <div className={cx("navbar_search")}>
          <div className={cx("wrapper")}>
            <div className={cx("first")}>
              <Link href="/" className={cx("logo")}>
                <LogoIcon />
              </Link>
            </div>
            <div className={cx("search_box")}></div>

            <div className={cx("last")} onClick={openMoreNav}>
              <div className={cx("modal")}>
                <MoreNavComp tippy={tippy} position="bottom-left" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default NavbarSearch;
