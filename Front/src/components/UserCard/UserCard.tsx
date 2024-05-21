import classNames from "classnames/bind";
import styles from "./style/UserCard.module.scss";

import Avatar from "~/components/Avatar/Avatar";

import Link from "next/link";
import TippyCustom from "~/utility/Tippy/TooltipCustom";
import UserCardHover from "./UserCardHover";
import { FormattedMessage } from "react-intl";
import { FC } from "react";
const cx = classNames.bind(styles);
interface UserCardProps {
  data: any;
  follow: boolean;
  setFollow: Function;
}

const UserCard: FC<UserCardProps> = ({ data, follow, setFollow }) => {

  return (
    <div className={cx("wrapper")}>
      <span>
        <TippyCustom
          content={<UserCardHover key={data.id} setFollow={setFollow} follow={follow} data={data} />}
          haveClick
          theme="element"
          place="bottom-start"
        >
          <div className={cx("avatar")}>
            <Avatar link={data.slug} src={data.avatar} size={44} />
          </div>
        </TippyCustom>
      </span>
      <div className={cx("infor")}>
        <Link href={`/${data.slug}`} className={cx("username")}>
          <span>{data.userName}</span>
        </Link>

        <div className={cx("fullname")}>
          <span>
            <FormattedMessage id="Submain.suggested" />
          </span>
        </div>
      </div>
    </div>
  );
}
export default UserCard;