"use client"
import classNames from "classnames/bind";
import styles from "$app/settings/SettingFriendPage.module.scss";
import { FormattedMessage } from "react-intl";

import PostCard from "~/components/Settings/PostCard";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { IRootState } from "~/redux/reducers/rootReducer";
import postServices from "~/services/postServices";
import { ToastContainer } from "react-toastify";
const cx = classNames.bind(styles);

export default function SettingPostPage() {

    const idUser = useSelector<IRootState, any>(state => state.auth.data.id);
    const [listData, setListData] = useState<any>([]);
    useEffect(() => {
        async function fetchData() {
            const result = await postServices.getAllPostSetting(idUser);
            console.log(result);
            setListData(result.dataPost);
        }
        if (idUser) {
            fetchData();
        }
    }, [idUser])
    return (
        <>
            <div className={cx("wrapper")}>
                {
                    listData.map((post: any) => (

                        <PostCard key={post.id} data={post} />
                    ))
                }
            </div>
            <ToastContainer />
        </>
    )
}
