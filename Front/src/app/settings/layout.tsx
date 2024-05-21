"use client"
import classNames from "classnames/bind";
import styles from "$app/settings/LayoutSettingPage.module.scss";
import { FormattedMessage } from "react-intl";
import { ReactNode } from "react";
import Link from "next/link";
import { useRouter, usePathname } from 'next/navigation';
import { ToastContainer } from "react-toastify";
import NavbarSearch from "~/components/Navbar/NavbarSearch";
import Navbar from "~/components/Navbar/Navbar";
// ...
interface Props {
    children: ReactNode;

}
const cx = classNames.bind(styles);

export default function SettingLayoutPage({ children }: Props) {
    const router = usePathname();
    console.log(router);
    return (
        <>
            <nav>
                <NavbarSearch />

                <Navbar />
            </nav>
            <div className={cx("wrapper")}>
                <div className={cx("main")}>
                    <div className={cx("side_bar")}>
                        <Link href='/settings' className={cx("side_button", router === "/settings" && "active")}>
                            <FormattedMessage id="Settings.General" />
                        </Link>
                        <Link href='/settings/friends' className={cx("side_button", router === "/settings/friends" && "active")}>
                            <FormattedMessage id="Settings.Friends" />
                        </Link>
                        <Link href='/settings/posts' className={cx("side_button", router === "/settings/posts" && "active")}>
                            <FormattedMessage id="Settings.Posts" />
                        </Link>
                    </div>
                    <div className={cx("infor_wrapper")}>
                        {children}
                    </div>
                </div>

            </div>
        </>
    )
}
