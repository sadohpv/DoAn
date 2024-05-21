// "use client";
import Link from "next/link";
import classNames from "classnames/bind";
import styles from "./LikeModalList.module.scss";
import { CloseIcon, CommentIconFill, HeartIconFill } from "~/assets/icon";

import { FC, useState, useRef, useEffect } from "react";
import { FormattedMessage, FormattedNumber } from "react-intl";
import { useSelector } from "react-redux";
import postServices from "~/services/postServices";
import FullPostComp from "./FullPost";
import UserCard from "../UserCard/UserCard";
import UserCardSubmain from "../UserCard/UserCardSubmain";
// import vi from "moment/locale/vi"

const cx = classNames.bind(styles);
interface LikeModalListProps {
    data: any;
    idUser: number;
    setLikeModal?: any;
}

const LikeModalList: FC<LikeModalListProps> = ({ setLikeModal, data, idUser }) => {
    const [listLike, setListLike] = useState([]);
    console.log(listLike);

    useEffect(() => {

        async function fetchData() {
            const result = await postServices.handleGetListLikePost(data.id, idUser);
            // console.log(result);
            setListLike(result.data);
        }

        fetchData()

    }, [])
    const handleCloseModal = () => {

        if (typeof setLikeModal == "function") {
            setLikeModal(false);
        }

    }
    return (
        <div className={cx("wrapper")}>
            <div className={cx("close_button")} onClick={handleCloseModal}>
                <CloseIcon />
            </div>
            <div className={cx("title")}>
                <FormattedMessage id="Post.Likes" />
            </div>
            <div className={cx("body")}>
                <div className={cx("main")}>
                    {
                        listLike.map((item: any, index: number) => (
                            <UserCardSubmain data={item.User} key={index} />

                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default LikeModalList;
