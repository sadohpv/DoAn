"use client"
import classNames from "classnames/bind";
import styles from "$app/admin/AdminPageLayout.module.scss";
import { Children, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { IRootState } from "~/redux/reducers/rootReducer";
import AdminNav from "~/components/Admin/AdminNav";
const cx = classNames.bind(styles);

export default function AdminPage({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const [admin, setAdmin] = useState(true);
    const role = useSelector<IRootState, any>(state => state.auth.data.role);


    console.log(role);
    useEffect(() => {
        if (role === "ADMIN") {
            setAdmin(true);
        }
    }, [role])
    return (
        <>
            {
                admin ?
                    <div className={cx("wrapper")}>
                        <div className={cx("task_bar")}>
                            <AdminNav />
                        </div>
                        <div className={cx("main")}>
                            {children}
                        </div>
                    </div>
                    :
                    <>
                    </>
            }
        </>
    )
}