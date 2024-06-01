"use client"
import classNames from "classnames/bind";
import styles from "$app/admin/AdminCommentPage.module.scss"
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import adminService from "~/services/adminService";
import AdminCommentList from "~/components/Admin/AdminCommentList";

const cx = classNames.bind(styles);
export default function AdminCommentPage({ }: {}) {

    const [dataCache, setDataCache] = useState<any[]>([]);

    useEffect(() => {
        async function fetchData() {
            const result = await adminService.handleGetCommentReport();
            if (result.result) {
                setDataCache(result.result)
            }
        }
        fetchData();
    }, [])
    return (
        <>
            <div className={cx("wrapper")}>
                {
                    dataCache.length > 0 && dataCache.map((data) => {
                        if (data.Comments.some((post: any) => post.Reports.length > 0))
                            return (
                                <AdminCommentList key={`User_${data.id}`} data={data} />
                            )
                    })
                }
            </div>
            <ToastContainer />
        </>
    )
}