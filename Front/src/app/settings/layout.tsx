"use client"
import classNames from "classnames/bind";
import styles from "$app/settings/LayoutSettingPage.module.scss";
import { FormattedMessage } from "react-intl";
import { ReactNode, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from 'next/navigation';
import { ToastContainer } from "react-toastify";
import NavbarSearch from "~/components/Navbar/NavbarSearch";
import Navbar from "~/components/Navbar/Navbar";
import { useSelector } from "react-redux";
import { IRootState } from "~/redux/reducers/rootReducer";
// import { useRouter } from "next/navigation";

interface Props {
    children: ReactNode;

}
const cx = classNames.bind(styles);

export default function SettingLayoutPage({ children }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const [complain, setComplain] = useState("");
    const [inputComplain, setInputComplain] = useState(false);

    const ban = useSelector<IRootState, any>(state => state.auth.data.ban);
    if (ban) {
        if (ban.includes("ACCOUNT") && (pathname !== "/settings/posts" && pathname !== "/settings")) {
            return router.replace(`/settings`);
        }
    }
    const handleChangeComplain = (e: any) => {
        setComplain(e.target.value);
    }
    const handleToggleComplain = () => {
        setInputComplain(!inputComplain);
    }
    return (
        <>
            <nav>
                <NavbarSearch />

                <Navbar />
            </nav>
            <div className={cx("wrapper")}>
                <div className={cx("main")}>
                    <div className={cx("main_bar")}>
                        <div className={cx("side_bar")}>
                            <Link href='/settings' className={cx("side_button", pathname === "/settings" && "active")}>
                                <FormattedMessage id="Settings.General" />
                            </Link>
                            {
                                !ban.includes("ACCOUNT") &&
                                <Link href='/settings/friends' className={cx("side_button", pathname === "/settings/friends" && "active")}>
                                    <FormattedMessage id="Settings.Friends" />
                                </Link>
                            }
                            <Link href='/settings/posts' className={cx("side_button", pathname === "/settings/posts" && "active")}>
                                <FormattedMessage id="Settings.Posts" />
                            </Link>
                        </div>
                        {
                            ban.includes("ACCOUNT") &&
                            <div className={cx("complain_box")}>
                                {
                                    inputComplain &&
                                    <div className={cx("complain_input")}>
                                        <input value={complain} onChange={(e) => handleChangeComplain(e)} />
                                    </div>
                                }
                                <div className={cx("complain_content")}>
                                    <FormattedMessage id="Report.Complain_message" />
                                </div>
                                <div className={cx("complain_button")} onClick={handleToggleComplain}>
                                    <FormattedMessage id="Report.Complain" />
                                </div>
                            </div>
                        }
                    </div>

                    <div className={cx("infor_wrapper")}>
                        {children}
                    </div>
                </div>

            </div >
        </>
    )
}
