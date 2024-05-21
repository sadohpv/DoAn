"use client";
import Link from "next/link";
import classNames from "classnames/bind";
import styles from "./NotifyComp.module.scss";
import { HeartIcon } from "~/assets/icon";
import { usePathname } from "next/navigation";
import { FC, useEffect, useState } from "react";
import TippyCustom from "~/utility/Tippy/TooltipCustom";
import { FormattedMessage } from "react-intl";
import NotifyBox from "./NotifyBox";
import notifyServices from "~/services/notifyServices";
import { useSelector } from "react-redux";
import { RootState } from "~/redux/store";
const cx = classNames.bind(styles);
interface NotifyCompProps {
  setModal: (modal: boolean) => void;
  modal: boolean;
  page: number;
  tippy: boolean | null;

  setPage: (page: number) => void;
}

const NotifyComp: FC<NotifyCompProps> = ({
  setModal,
  modal,
  page,
  setPage,
  tippy,
}) => {
  const router = usePathname();
  const [active, setActive] = useState<boolean>(false);
  const idUser = useSelector<RootState, any>(state => state.auth.data.id);
  const [listNotify, setListNotify] = useState([])
  const [notifyNumber, setNotifyNumber] = useState(0);
  const [reload, setReload] = useState(false);

  const handleToggle = () => {
    if (page === 2) {
      setPage(0);
      setModal(false);
    } else {
      setPage(2);
      setModal(true);
    }
  };
  async function fectchData() {
    const result = await notifyServices.handleGetAllNotify(idUser);
    setListNotify(result.result);

    let count = 0;
    result.result.map((item: any) => {
      if (item.status === "UNREAD") {

        count++;
      }
    })
    setNotifyNumber(count);
  }
  useEffect(() => {

    if (idUser) {
      fectchData();
    }
  }, [idUser])
  const handleRead = async (id: any) => {
    const result = await notifyServices.handleReadNotify(id);
    fectchData();
  }

  return (

    <>
      {
        tippy !== null ? (
          <TippyCustom
            content={<FormattedMessage id="Navbar.notify" />}
            place={tippy === true ? "top" : "right"}
          >
            <div
              className={cx("nav_item", modal && "active", page === 2 && "border")}
              onClick={handleToggle}
            >
              <div className={cx("icon")}>
                <HeartIcon fill={page === 2 ? "var(--text-color)" : "none"} />
              </div>
              <span>
                <FormattedMessage id="Navbar.notify" />
              </span>
              {
                notifyNumber > 0 &&
                <div className={cx("notify_number")}>
                  {notifyNumber}
                </div>
              }
            </div>
          </TippyCustom >
        ) : (
          <div
            className={cx("nav_item", modal && "active", page === 2 && "border")}
            onClick={handleToggle}
          >
            <div className={cx("icon")}>
              <HeartIcon fill={page === 2 ? "var(--text-color)" : "none"} />
            </div>
            <span>
              <FormattedMessage id="Navbar.notify" />
            </span>
            {
              notifyNumber > 0 &&
              <div className={cx("notify_number")}>
                {notifyNumber}
              </div>
            }
          </div>
        )
      }
      {
        page === 2 && (
          <div className={cx("notify_box")}>
            <div className={cx("title")}>
              <FormattedMessage id="Navbar.notify" />

            </div>
            <div className={cx("notify_box-main")}>
              {
                listNotify.map((item: any) => (
                  <NotifyBox onHover={handleRead} unread={item.status === "UNREAD" ? true : false} setReload={setReload} key={item.id} data={item} />
                ))
              }
            </div>
          </div>
        )
      }
    </>
  )

};

export default NotifyComp;
