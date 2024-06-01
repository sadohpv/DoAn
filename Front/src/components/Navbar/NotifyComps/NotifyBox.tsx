import { FC, useState } from "react"
import styles from "./NotifyBox.module.scss";
import classNames from "classnames/bind";
import Avatar from "~/components/Avatar/Avatar";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";
import { LANGUAGE } from "~/utility/constants/constants";

import Moment from "react-moment";
import notifyServices from "~/services/notifyServices";
const cx = classNames.bind(styles);

interface NotifyBoxProps {
    data: any;

    setReload?: any;
    unread?: any;
    onHover?: any;
}

const NotifyBox: FC<NotifyBoxProps> = ({ data, unread, setReload, onHover }) => {

    const language = useSelector<any>(state => state.app.language);
    const handleHover = async () => {
        if (data.type !== "LIKECOMMENT" && data.type !== "LIKEPOST") {
            if (unread) {
                onHover(data.id);
            }
        }
    }

    const handleToPostPage = () => {
        if (data.type === "COMMENT") {
            if (data.content.split(' ')[1]) {
                window.location.replace(`/post/${data.content.split(' ')[1]}`);
            }
        }
    }
    return (
        <>
            <div className={cx("wrapper", unread && "unread", data.type === "COMMENT" && "comment_notify")} onClick={handleToPostPage} onMouseEnter={handleHover}>
                <div className={cx("avatar")} >
                    {
                        data.type === "COMMENT" &&
                        <Avatar src={data.UserFrom.avatar} size={42} disableLink={true} />

                    }
                    {
                        data.type === "ADDFRIEND" &&
                        <Avatar src={data.UserFrom.avatar} link={data.UserFrom.slug} size={42} />
                    }
                </div>
                <div className={cx("infor", (data.type === 'LIKECOMMENT' || data.type === 'LIKEPOST') && "ban_message")} >
                    {
                        data.type === 'ADDFRIEND' &&
                        <div className={cx("message")}>
                            <FormattedMessage id="Notify.friend_request_1" />
                            <a href={`/${data.UserFrom.slug}`} className={cx("link")}>
                                {data.UserFrom.userName}
                            </a>
                            <FormattedMessage id="Notify.friend_request_2" />
                        </div>
                    }
                    {
                        data.type === 'COMMENT' &&
                        <div className={cx("message")} >
                            <a href={`/${data.UserFrom.slug}`} className={cx("link")}>
                                {data.UserFrom.userName}
                            </a>
                            <FormattedMessage id="Notify.comment_tag_1" />
                        </div>

                    }
                    {
                        data.type === 'LIKECOMMENT' &&
                        <div className={cx("message")} >
                            <FormattedMessage id="Notify.commen_ban" />
                            <p className={cx("note")}>
                                <FormattedMessage id="Notify.remove_unban" /> 
                            </p>

                        </div>

                    }
                    {
                        data.type === 'LIKEPOST' &&
                        <div className={cx("message")} >
                            <FormattedMessage id="Notify.post_ban" />
                            <p className={cx("note")}>
                                <FormattedMessage id="Notify.remove_unban" /> 
                            </p>

                        </div>

                    }
                    <div className={cx("time")}>
                        <Moment locale={language == LANGUAGE.EN ? LANGUAGE.EN : LANGUAGE.VI} fromNow>
                            {data.createdAt}
                        </Moment>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NotifyBox;