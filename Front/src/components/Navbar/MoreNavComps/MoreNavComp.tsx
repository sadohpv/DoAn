"use client";
import Link from "next/link";
import classNames from "classnames/bind";
import styles from "./MoreNavComp.module.scss";
import { SettingIcon } from "~/assets/icon";
import { usePathname } from "next/navigation";
import { FC, useState } from "react";
import TooltipCustom from "~/utility/Tippy/TooltipCustom";
import { FormattedMessage } from "react-intl";

import MoreNavModal from "./MoreNavModal";
const cx = classNames.bind(styles);
interface MoreNavCompProps {
  tippy?: boolean | null;
  modal?: boolean;
  position: "top" | "bottom-left" | "left" | "right";
}

const MoreNavComp: FC<MoreNavCompProps> = ({
  modal,
  tippy,
  position = "top",
}) => {
  const [active, setActive] = useState<boolean>(false);
  // console.log(router);
  const router = usePathname();
  const handleToggle = () => {
    setActive(!active);
    // if (page === 4) {
    //   setPage(0);
    //   // setModal(false);
    // } else {
    //   setPage(4);
    //   // setModal(true);
    // }
  };
  return tippy !== null ? (
    <>
      {active === true && (
        <div className={cx("modal", position)}>
          <MoreNavModal />
        </div>
      )}
      <TooltipCustom
        content={<FormattedMessage id="Navbar.more" />}
        place={
          tippy === true
            ? "top"
            : position === "bottom-left"
            ? "bottom"
            : "right"
        }
      >
        <div
          className={cx(
            "nav_item",
            modal && "active",
            active === true && "border"
          )}
          onClick={handleToggle}
        >
          <div className={cx("icon")}>
            <SettingIcon
            // fill={page === 1 ? "var(--text-color)" : "none"}
            // strokeWidth={page === 1 ? "3" : "none"}
            />
          </div>
          <span>
            <FormattedMessage id="Navbar.more" />
          </span>
        </div>
      </TooltipCustom>
    </>
  ) : (
    <>
      {active === true && (
        <div className={cx("modal", position)}>
          <MoreNavModal />
        </div>
      )}
      <div
        className={cx(
          "nav_item",
          modal && "active",

          active === true && "border"
        )}
        onClick={handleToggle}
      >
        <div className={cx("icon")}>
          <SettingIcon />
        </div>
        <span>
          <FormattedMessage id="Navbar.more" />
        </span>
      </div>
    </>
  );
};

export default MoreNavComp;
