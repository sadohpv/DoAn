import TippyCustom from "~/utility/Tippy/TooltipCustom";
import styles from "./AdminCommentList.module.scss";
import classNames from "classnames/bind";
import { FormattedMessage } from "react-intl";
import { AvatarDefault, CommentIcon, CommentIconFill, ContentIcon, HomeIcon } from "~/assets/icon";
import Link from "next/link";
import Avatar from "../Avatar/Avatar";
import AdminPostItem from "./AdminPostItem";
import { useState } from "react";
import AdminCommentItem from "./AdminCommentItem";
const cx = classNames.bind(styles);

function AdminCommentList({ data }: { data: any }) {
    const [dataList, setDataList] = useState<any>(data.Comments);
    const [hide, setHide] = useState(false);
    const handleFilterData = (id: any) => {
        const filter = dataList.filter((post: any) => post.id !== id);
        if (filter.some((post: any) => post.Reports.length > 0)) {
            setDataList(filter);
        } else {
            setDataList(filter);
            setHide(true);
        }
    }
    return (
        <div className={cx("list_box", hide && "hide")}>
            <div className={cx("list_box-header")}>
                <Avatar size={40} src={data.avatar} />
                <div className={cx("name")}>
                    {data.userName}
                </div>
                <div className={cx("name")}>
                    {data.slug}
                </div>
            </div>
            <div className={cx("list_box-main")}>
                {
                    dataList && dataList.length > 0 && dataList.map((comment: any) => {
                        if (comment.Reports.length > 0)
                            return (
                                <AdminCommentItem key={comment.id} handleFilterData={handleFilterData} data={comment} />
                            )
                    })
                }
            </div>
        </div>
    );
}

export default AdminCommentList;
