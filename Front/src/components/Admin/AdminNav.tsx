import TippyCustom from "~/utility/Tippy/TooltipCustom";
import styles from "./AdminNav.module.scss";
import classNames from "classnames/bind";
import { FormattedMessage } from "react-intl";
import { AvatarDefault, CommentIcon, CommentIconFill, ContentIcon, HomeIcon } from "~/assets/icon";
import Link from "next/link";
const cx = classNames.bind(styles);

function AdminNav() {
    return (
        <div className={cx("wrapper")}>
            <TippyCustom content={<FormattedMessage id="Navbar.home" />}>
                <a href="/" className={cx("adnav_item")}>
                    <HomeIcon />
                </a>
            </TippyCustom>
            <TippyCustom content={<FormattedMessage id="Navbar.User_manage" />}>
                <Link href={'/admin'} className={cx("adnav_item")}>
                    <AvatarDefault fill="var(--text-color)" height="48px" width="48px" />
                </Link>
            </TippyCustom>

            <TippyCustom content={<FormattedMessage id="Navbar.Post_manage" />}>
                <Link href={'/admin/posts'} className={cx("adnav_item")}>
                    <ContentIcon height="24px" width="24px" />
                </Link>
            </TippyCustom>
            <TippyCustom content={<FormattedMessage id="Navbar.Comment_manage" />}>
                <Link href={'/admin/comments'} className={cx("adnav_item")}>
                    <CommentIconFill width="20px" height="20px" />
                </Link>
            </TippyCustom>
        </div>
    );
}

export default AdminNav;
