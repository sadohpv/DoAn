"use client"
import classNames from "classnames/bind";
import styles from "$app/admin/AdminPage.module.scss";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { IRootState } from "~/redux/reducers/rootReducer";
const cx = classNames.bind(styles);

export default function AdminPage({ params }: { params: { user: string } }) {

    const [admin, setAdmin] = useState(false);
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
                        ADMIN 
                    </div>
                    :
                    <>
                    </>
            }
        </>
    )
}