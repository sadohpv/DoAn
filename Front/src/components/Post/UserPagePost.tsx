// "use client";
import Link from "next/link";
import classNames from "classnames/bind";
import styles from "./UserPagePost.module.scss";
import { CloseIcon, CommentIconFill, HeartIconFill } from "~/assets/icon";

import { FC, useState, useRef, useEffect } from "react";
import { FormattedMessage, FormattedNumber } from "react-intl";
import { useSelector } from "react-redux";
import postServices from "~/services/postServices";
import FullPostComp from "./FullPost";
// import vi from "moment/locale/vi"

const cx = classNames.bind(styles);
interface UserPagePostCompProps {
    data: any;
    likeList: any;
    dataUserPage: any;
    author?: any;
}

const UserPagePostComp: FC<UserPagePostCompProps> = ({ author, data, dataUserPage, likeList }) => {
    if (author) {
        data.author = author;
    } else {
        data.author = dataUserPage;
    }
    const [hover, setHover] = useState<boolean | null>(null);
    const [modalFullPost, setModalFullPost] = useState<boolean>(false);
    const [like, setLike] = useState<boolean>(likeList ? likeList.includes(data.id) : false);
    const [likeNumber, setLikeNumber] = useState(data.likeNumber);
    const [commentNumber, setCommentNumber] = useState(data.commentNumber);
    const [listLike, setListLike] = useState(likeList ? likeList : []);
    const idUser = useSelector<any>(state => state.auth.data.id);

    const handleOnHoverPicPost = () => {
        // console.log("Here");
        setHover(true);
    };
    const handleUnHover = () => {
        setHover(false);
    };
    const handleOpenFullPost = () => {
        setModalFullPost(true);
        const body = window.document.getElementsByTagName("body")[0];
        body.style.overflow = "hidden";
    };

    const handleCloseFullPost = () => {
        setModalFullPost(false);
        const body = window.document.getElementsByTagName("body")[0];
        body.style.overflow = "auto";
    };

    const handleLike = async () => {
        setLike(!like);
        const payload = {
            userId: idUser,
            postId: data.id,
            like: !like,
        };
        const result = await postServices.handleToggleLikePost(payload);
        if (like === true) {
            setListLike(listLike.filter((item: any) => item !== data.id));
            setLikeNumber(likeNumber - 1);
        } else {
            const listAdd = [...listLike, data.id];
            setListLike(listAdd);
            setLikeNumber(likeNumber + 1);
        }
    };

    return (
        <>
            <div
                className={cx("wrapper")}
                onClick={handleOpenFullPost}
                onMouseOut={handleUnHover}
                onMouseOver={handleOnHoverPicPost}>
                <div className={cx("post_pic")}>
                    {data.typeFile === false ? (
                        <img src={data.img} />
                    ) : (
                        <video
                            playsInline
                            disablePictureInPicture
                            disableRemotePlayback
                            preload="metadata"
                            muted
                            controls={false}
                            controlsList="nofullscreen nodownload noremoteplayback noplaybackrate">
                            <source src={data.img} />
                        </video>
                    )}
                </div>
                {hover && (
                    <div className={cx("infor_hover", "move_in")}>
                        <div className={cx("infor")}>
                            <div className={cx("infor_item")}>
                                <HeartIconFill fill="white" />
                                <span className={cx("text")}>
                                    <FormattedNumber notation="compact" maximumFractionDigits={2} value={likeNumber} />
                                </span>
                            </div>
                            <div className={cx("infor_item")}>
                                <CommentIconFill width="20px" height="20px" />
                                <span className={cx("text")}>
                                    <FormattedNumber
                                        notation="compact"
                                        maximumFractionDigits={2}
                                        value={commentNumber}
                                    />
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {modalFullPost && (
                <div className={cx("modalFullPost")}>
                    <FullPostComp
                        like={like}
                        handleLike={handleLike}
                        commentFatherNumber={commentNumber}
                        setCommentFatherNumber={setCommentNumber}
                        likeFatherNumber={likeNumber}
                        likeList={listLike}
                        data={data}
                    />
                    <div className={cx("close")} onClick={handleCloseFullPost}>
                        <CloseIcon width="42px" height="42px" />
                    </div>
                </div>
            )}
        </>
    );
};

export default UserPagePostComp;
