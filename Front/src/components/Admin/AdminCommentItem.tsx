import TippyCustom from "~/utility/Tippy/TooltipCustom";
import styles from "./AdminCommentItem.module.scss";
import classNames from "classnames/bind";
import { FormattedMessage } from "react-intl";
import { AvatarDefault, CommentIcon, CommentIconFill, ContentIcon, HomeIcon } from "~/assets/icon";
import Link from "next/link";
import Avatar from "../Avatar/Avatar";
import postServices from "~/services/postServices";
import { toast } from "react-toastify";
import { report } from "process";
import { useState } from "react";
import commentServices from "~/services/commentServices";
const cx = classNames.bind(styles);

function AdminCommentItem({ data, handleFilterData }: { data: any, handleFilterData: any }) {
    const [modal, setModal] = useState(false);
    const openModal = () => {
        setModal(!modal);
    }
    const handleComTag = (comment: any) => {
        const breakLine = comment.split("\n");
        if (breakLine.length > 1) {
            return (
                <div className={cx("tag")}>
                    {breakLine.map((line: any, index: any) => {
                        const lineTag = line.split("@t@g");
                        return (
                            <span key={index}>
                                {lineTag.map((item: any, index: any) => handleNextTag(lineTag, item, index))}
                                <br></br>
                            </span>
                        );
                    })}
                </div>
            );
        } else {
            const result = comment.split("@t@g");
            return (
                <div className={cx("tag")}>
                    {result.map((item: any, index: any) =>
                        handleNextTag(result, item, index))
                    }
                </div>
            );
        }
    };
    const handleNextTag = (result: any, item: any, index: any) => {
        if (item.includes("@")) {
            return (
                <a key={Math.random()} className={cx("tag_link")} href={`/${item.slice(1)}`}>
                    {result[++index].slice(2)}
                </a>
            );
        }
        if (item.includes("$*")) {
            return <span key={Math.random()} ></span>;
        } else {
            return <span key={Math.random()} >{result[index]}</span>;
        }
    };
    const handleDeletePost = async () => {
        const result = await commentServices.deleteComment(data.id);
        if (result.result) {
            toast.success(<FormattedMessage id="Post.Delete_success" />, {
                autoClose: 3000
            })
            handleFilterData(data.id);
        } else {
            toast.error(<FormattedMessage id="Post.Delete_failed" />, {
                autoClose: 3000
            })
        }
        openModal();
    }
    return (
        <>
            <div className={cx("item_box")}>
                <div className={cx("item_image")}>
                    {
                        handleComTag(data.content)
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
                            <div className={cx("button", "delete")} onClick={handleDeletePost}>
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

export default AdminCommentItem;
