"use client"
import classNames from "classnames/bind";
import styles from "$app/admin/AdminPostPage.module.scss"
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import adminService from "~/services/adminService";
import AdminPostList from "~/components/Admin/AdminPostList";

const cx = classNames.bind(styles);
export default function AdminPostPage({ }: {}) {

    const [dataCache, setDataCache] = useState<any[]>([]);

    useEffect(() => {
        async function fetchData() {
            const result = await adminService.handleGetPostReport();
            setDataCache(result.result)
        }
        fetchData();
    }, [])
    return (
        <>
            <div className={cx("wrapper")}>
                {
                    dataCache.length > 0 && dataCache.map((data) => {
                        if (data.Posts.some((post: any) => post.Reports.length > 0))
                            return (
                                <AdminPostList key={`User_${data.id}`} data={data} />
                            )
                    })
                }
            </div>
            <ToastContainer />
        </>
    )
}