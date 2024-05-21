import { FormattedMessage } from "react-intl";
import styles from "./PostCard.module.scss";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import useDebounce from "~/utility/Debounce/useDebounce";
import userServices from "~/services/userServices";
import { ToastContainer, toast } from "react-toastify";
import Avatar from "../Avatar/Avatar";
import Link from "next/link";
import postServices from "~/services/postServices";
// import { Link } from "next/navigation";
const cx = classNames.bind(styles);

interface Props {
    data: any;
}
function PostCard({ data }: Props) {

    const [editTab, setEditTab] = useState(false);
    const [currentContent, setCurrentContent] = useState<any>(data.content)
    const handleEditPost = async () => {
        setEditTab(!editTab);
        if (editTab === true) {
            const payload = {
                idPost: data.id,
                content: currentContent
            }
            try {

                const result = await postServices.handleUpdatePost(payload)
                if (result) {
                    toast.success(<FormattedMessage id="Settings.Change_data_message_success" />, {
                        autoClose: 3000
                    })
                } else {
                    toast.error(<FormattedMessage id="Settings.Change_data_message_failed" />, {
                        autoClose: 3000
                    })
                }
            } catch (error) {
                toast.error(<FormattedMessage id="Settings.Change_data_message_failed" />, {
                    autoClose: 3000
                })
                setCurrentContent(data.content);
            }

        }
    }

    const handleSetContentPost = (e: any) => {
        setCurrentContent(e.target.value);
    }

    return (
        <>
            <div className={cx("wrapper")}>
                <Link href={`/post/${data.id}`} className={cx("img")}>
                    {
                        data.typeFile === false ?
                            <img src={data.img} /> :
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
                    }
                </Link>
                <div className={cx("content")}>
                    {
                        editTab ?
                            <textarea autoFocus onChange={(e) => handleSetContentPost(e)} value={currentContent} />
                            :
                            <>
                                {currentContent}
                            </>
                    }

                </div>
                <div className={cx("like_com")}>
                    <span>
                        {data.likeNumber} <FormattedMessage id="Post.Likes" />
                    </span>
                    <span>
                        {data.commentNumber} <FormattedMessage id="Post.Comments" />
                    </span>

                </div>
                <div className={cx("type")}>
                    {
                        data.typeFile === false ?
                            <FormattedMessage id="Common.Photo" />
                            :
                            <FormattedMessage id="Common.Video" />
                    }
                </div>
                <div className={cx("action")}>
                    <div className={cx("button_edit_post")} onClick={handleEditPost}>
                        {
                            editTab ?
                                <FormattedMessage id="Common.Save" />
                                :
                                <FormattedMessage id="Common.Edit" />
                        }

                    </div>
                </div>
            </div >
        </>

    );

}

export default PostCard;
