"use client"
import classNames from "classnames/bind";
import styles from "$app/user/SavePage.module.scss";
import { FormattedMessage } from "react-intl";
import FriendCard from "~/components/Settings/FriendCard";
import { useEffect, useState } from "react";
import friendServices from "~/services/friendServices";
import { useSelector } from "react-redux";
import { IRootState } from "~/redux/reducers/rootReducer";
import userServices from "~/services/userServices";
import Avatar from "~/components/Avatar/Avatar";
import { ContentIcon, EmptyIcon, ImageIcon, VideoIcon } from "~/assets/icon";
import postServices from "~/services/postServices";
import UserPagePostComp from "~/components/Post/UserPagePost";
import { useRouter } from "next/navigation";
const cx = classNames.bind(styles);

export default function SavePage({ params }: { params: { user: string } }) {
    const [dataUserPage, setDataUserPage] = useState<any>({});
    const [listPost, setListPost] = useState<any[]>([])
    const [likeList, setLikeList] = useState<any>([])
    const [loading, setLoading] = useState(false);
    const idUser = useSelector<IRootState, any>(state => state.auth.data.id);
    const slug = useSelector<IRootState, any>(state => state.auth.data.slug);
    const router = useRouter();
    const ban = useSelector<IRootState, any>(state => state.auth.data.ban);
    if (ban) {
        if (ban.includes("ACCOUNT")) {
            return router.replace(`/settings`);
        }
    }
    useEffect(() => {
        async function fetchData() {
            const result = await userServices.getDataForUserPage(params.user, idUser);
            setDataUserPage(result);

        }
        if (idUser) {
            if (params.user === slug) {
                fetchData();
                getSavePost();
                setLoading(true);
            } else {
                router.replace(`/${slug}/save`)
            }

        }
        async function getSavePost() {
            const postList = await postServices.handleGetSavePost(params.user, idUser);
            if (postList) {
                setListPost(postList.dataPost);
                setLikeList(postList.checkLike);
            }
        }
    }, [idUser])

    return (
        <>
            {
                loading &&
                <div className={cx("wrapper")}>
                    <div className={cx("header")}>
                        <div className={cx("avatar")}>
                            <Avatar disableLink size={150} src={dataUserPage.avatar} />
                        </div>
                        <div className={cx("infor")}>
                            <div className={cx("infor_1")}>
                                <div className={cx("name")}>
                                    {dataUserPage.slug}
                                </div>
                            </div>
                            <div className={cx("infor_2")}>
                                <div className={cx("middle_item")}>
                                    <div className={cx("number")}>
                                        <span>{dataUserPage._count?.Posts}</span>
                                    </div>
                                    <div className={cx("text")}>
                                        <span>
                                            <FormattedMessage id="Common.posts" />
                                        </span>
                                    </div>
                                </div>
                                <div className={cx("middle_item")}>
                                    <div className={cx("number")}>
                                        <span>{dataUserPage._count?.FollowTo}</span>
                                    </div>
                                    <div className={cx("text")}>
                                        <span>
                                            <FormattedMessage id="Common.followers" />
                                        </span>
                                    </div>
                                </div>
                                <div className={cx("middle_item")}>
                                    <div className={cx("number")}>
                                        <span>{dataUserPage._count?.FollowFrom}</span>
                                    </div>
                                    <div className={cx("text")}>
                                        <span>
                                            <FormattedMessage id="Common.following" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className={cx("infor_3")}>
                                <div className={cx("name")}>
                                    {dataUserPage.userName}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={cx("body")}>

                        <div className={cx("body_main", listPost.length === 0 && "empty")}>
                            {
                                listPost.map((item: any) => {

                                    return <UserPagePostComp author={item.author} likeList={likeList} dataUserPage={dataUserPage} key={item.id} data={item} />
                                }
                                )
                            }
                            {
                                listPost.length === 0 &&
                                <div className={cx("empty_post")}>
                                    <EmptyIcon width="100px" height="100px" />

                                </div>
                            }
                        </div>
                    </div>
                </div>
            }

        </>
    )

}
