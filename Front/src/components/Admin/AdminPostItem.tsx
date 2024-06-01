import TippyCustom from "~/utility/Tippy/TooltipCustom";
import styles from "./AdminPostItem.module.scss";
import classNames from "classnames/bind";
import { FormattedMessage } from "react-intl";
import { AvatarDefault, CommentIcon, CommentIconFill, ContentIcon, HomeIcon } from "~/assets/icon";
import Link from "next/link";
import Avatar from "../Avatar/Avatar";
import postServices from "~/services/postServices";
import { toast } from "react-toastify";
import { report } from "process";
import { useState } from "react";
const cx = classNames.bind(styles);

function AdminPostItem({ data, handleFilterData }: { data: any, handleFilterData: any }) {
    const [modal, setModal] = useState(false);
    const openModal = () => {
        setModal(!modal);
    }

    const handleDeletePost = async () => {
        const result = await postServices.handleDeletePost(data.id);
        if (result.dataPost) {
            toast.success(<FormattedMessage id="Post.Delete_success" />, {
                autoClose: 3000
            })
            handleFilterData(data.id);
        } else {
            toast.error(<FormattedMessage id="Post.Delete_failed" />, {
                autoClose: 3000
            })

        }
    }
    return (
        <>
            <div className={cx("item_box")}>
                <div className={cx("item_image")}>
                    {
                        data.typeFile === false ?
                            <img src={data.img} /> :
                            <video
                                playsInline
                                disablePictureInPicture
                                disableRemotePlayback
                                preload="metadata"
                                muted
                                controls
                                controlsList="nofullscreen nodownload noremoteplayback noplaybackrate">
                                <source src={data.img} />
                            </video>
                    }
                </div>
                <div className={cx("item_content")}>
                    {
                        [1, 2, 3, 4, 5].map((index: any) => {
                            const filter = data.Reports.filter((report: any) => report.content === `${index}`).length;
                            if (filter > 0)
                                return (
                                    <div key={`Report_${data.id}_${index}`} className={cx("rule")}>
                                        <div className={cx("number")}>
                                            {filter}
                                        </div>
                                        <FormattedMessage id={`Report.Reason_user_${index}`} />
                                    </div>
                                )
                        })
                    }

                </div>
                <div className={cx("item_action")}>
                    <button className={cx("delete_button")} onClick={openModal}>
                        <FormattedMessage id="Common.Delete" />
                    </button>
                </div>
            </div>
            {
                modal &&
                <div className={cx("modal")}>
                    <div className={cx("modal_box")}>
                        <div className={cx("title")}>
                            <FormattedMessage id="Post.Delete_post_message" />
                        </div>
                        <div className={cx("action")}>
                            <div className={cx("button","delete")} onClick={handleDeletePost}>
                                <FormattedMessage id="Common.Delete" />

                            </div>
                            <div className={cx("button")} onClick={openModal}>
                                <FormattedMessage id="Common.Cancel" />

                            </div>
                        </div>
                    </div>
                </div>
            }
        </>

    );
}

export default AdminPostItem;
