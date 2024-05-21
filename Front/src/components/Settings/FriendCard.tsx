"use client"
import classNames from "classnames/bind";
import styles from "./FriendCard.module.scss";
import { FormattedMessage } from "react-intl";
import Avatar from "../Avatar/Avatar";
import Moment from "react-moment";
import { useSelector } from "react-redux";
import { useState } from "react";
import followServices from "~/services/followServices";
import { AddFriendIcon, UnfriendIcon } from "~/assets/icon";
import TippyCustom from "~/utility/Tippy/TooltipCustom";
import friendServices from "~/services/friendServices";
const cx = classNames.bind(styles);
interface Props {
    data: any;
    createAt: any;
    idUser: any;
    isFriend: any;
    fromOrTo: any;
}
export default function FriendCard({ fromOrTo, isFriend, data, createAt, idUser }: Props) {
    console.log(createAt);
    const [follow, setFollow] = useState(data.FollowTo.length > 0 ? true : false)
    const [addFriend, setAddFriend] = useState<any>(false);
    const language = useSelector<any>(state => state.app.language);

    const handleFollow = async () => {
        setFollow(!follow);
        const payload = {
            followFrom: idUser,
            followTo: data.id,
            status: !follow
        }
        const result = await followServices.handleCallApiFollow(payload);
    }
    const handleAcceptFriend = async () => {
        const payload = {
            userFrom: idUser,
            userTo: data.id,
            status: true
        }
        await friendServices.handleAcceptFriend(payload);
        setAddFriend(undefined);
    }
    const handleUnfriend = async () => {
        const payload = {
            userFrom: idUser,
            userTo: data.id,
            status: false
        }
        const result = await friendServices.handleCallApiFriend(payload);
        setAddFriend(true);
    }
    const handleAddfriend = async () => {
        const payload = {
            userFrom: idUser,
            userTo: data.id,
            status: true
        }
        await friendServices.handleCallApiFriend(payload);
        setAddFriend(null);
    }
    return (
        <>
            <div className={cx("wrapper")}>
                <div className={cx("avatar")}>
                    <Avatar link={data.slug} size={42} src={data.avatar} />
                </div>
                <div className={cx("name")}>
                    {data.userName}
                </div>
                <div className={cx("date")}>
                    <Moment locale={language == 'en' ? 'en' : 'vi'} fromNow>
                        {createAt}
                    </Moment>
                </div>
                <div className={cx("action")}>
                    <div className={cx("friend")}>
                        {
                            isFriend === true && addFriend === false &&
                            <TippyCustom content={<FormattedMessage id="UserPage.Unfriend" />}>
                                <span onClick={handleUnfriend}>
                                    <UnfriendIcon />
                                </span>
                            </TippyCustom>
                        }
                        {
                            addFriend === undefined &&
                            <TippyCustom content={<FormattedMessage id="UserPage.Unfriend" />}>
                                <span onClick={handleUnfriend}>
                                    <UnfriendIcon />
                                </span>
                            </TippyCustom>
                        }
                        {
                            addFriend === true &&
                            <TippyCustom content={<FormattedMessage id="UserPage.Add_Friend" />}>
                                <span className={cx("request3")} onClick={handleAddfriend}>
                                    <AddFriendIcon />
                                </span>
                            </TippyCustom>
                        }
                        {
                            addFriend === null &&
                            <TippyCustom content={<FormattedMessage id="UserPage.Cancel_add_friend" />}>
                                <span className={cx("request")} onClick={handleUnfriend}>
                                    <UnfriendIcon />
                                </span>
                            </TippyCustom>
                        }
                        {
                            isFriend === false && addFriend === false &&
                            <>
                                {
                                    fromOrTo === true ?
                                        <TippyCustom content={<FormattedMessage id="UserPage.Accept_add_friend" />}>
                                            <span className={cx("request2")} onClick={handleAcceptFriend}>
                                                <AddFriendIcon />
                                            </span>
                                        </TippyCustom>
                                        :
                                        <TippyCustom content={<FormattedMessage id="UserPage.Cancel_add_friend" />}>
                                            <span className={cx("request")} onClick={handleUnfriend}>
                                                <UnfriendIcon />
                                            </span>
                                        </TippyCustom>
                                }
                            </>
                        }
                    </div>
                    <div className={cx("follow")}>
                        {
                            follow ?
                                <span onClick={handleFollow}>
                                    <FormattedMessage id="Common.Unfollow" />
                                </span>
                                :
                                <span onClick={handleFollow}>
                                    <FormattedMessage id="Common.Follow" />
                                </span>
                        }
                    </div>


                </div>

            </div >
        </>
    )


}
