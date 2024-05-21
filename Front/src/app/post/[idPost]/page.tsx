"use client"
import { useRouter } from "next/router";
import classNames from "classnames/bind";
import styles from "$app/post/PostPage.module.scss";
import { useEffect, useState } from "react";
import postServices from "~/services/postServices";
import { useSelector } from "react-redux";
import { IRootState } from "~/redux/reducers/rootReducer";
import FullPostComp from "~/components/Post/FullPost";
import { LockIcon } from "~/assets/icon";
import { FormattedMessage } from "react-intl";

const cx = classNames.bind(styles);

export default function PostPage({ params }: { params: { idPost: string } }) {
    const idUser = useSelector<IRootState, any>(state => state.auth.data.id);
    const [data, setData] = useState<any>({});
    // const [likeFatherNumber, setLikeFatherNumber] = useState(0);
    const [listLike, setListLike] = useState([]);
    const [like, setLike] = useState<boolean>(false);
    const [likeNumber, setLikeNumber] = useState<number>(0);
    const [commentNumber, setCommentNumber] = useState<number>(0);
    // const [actionModal, setActionModal] = useState(false);
    // const [likeModal, setLikeModal] = useState(false);
    const [nullPost, setNullPost] = useState(false);
    useEffect(() => {
        async function fetchDataPost() {
            if (typeof +params.idPost === "number") {

                const result = await postServices.getPostById(+params.idPost, idUser)
                console.log(result);
                if (result.dataPost) {
                    setData(result.dataPost);
                    setLikeNumber(result.dataPost.likeNumber)
                    setCommentNumber(result.dataPost.commentNumber)
                    setLike(result.checkLike.includes(+params.idPost))
                    setListLike(result.checkLike);
                } else if (result.dataPost === null) {
                    setNullPost(true);
                } else {
                    // window.location.replace('/post');

                }
            }
        }
        if (idUser) {
            fetchDataPost();
        }
    }, [idUser]);

    const handleLike = async () => {

        setLike(!like);
        const payload = {
            userId: idUser,
            postId: data.id,
            like: !like
        }
        const result = await postServices.handleToggleLikePost(payload);
        if (like === true) {

            setLikeNumber(likeNumber - 1);
        } else {

            setLikeNumber(likeNumber + 1);
        }

    };
    return (
        <>
        
            {
                data.id && (
                    <div className={cx("wrapper")}>

                        <div className={cx("main")}>
                            <FullPostComp only={true} handleLike={handleLike} likeList={listLike} commentFatherNumber={commentNumber} setCommentFatherNumber={setCommentNumber} like={like} likeFatherNumber={likeNumber} data={data} />

                        </div>
                    </div>
                )
            }
            {
                nullPost &&
                <div className={cx("wrapper")}>

                    <div className={cx("main")}>
                        {

                            nullPost && (
                                <div className={cx("null_post")}>
                                    <LockIcon width="64px" height="64px" />
                                    <p>
                                        <FormattedMessage id="UserPage.Null_post" />
                                    </p>
                                </div>
                            )
                        }

                    </div>
                </div >

            }
        </>
    )
}
