import classNames from "classnames/bind";
import styles from "./style/UserCardHover.module.scss";

import Avatar from "~/components/Avatar/Avatar";

import Link from "next/link";
import TippyCustom from "~/utility/Tippy/TooltipCustom";
import { FormattedMessage } from "react-intl";
import { FC, useEffect, useState } from "react";
import { EmptyIcon } from "~/assets/icon";
const cx = classNames.bind(styles);
interface UserCardHoverProps {
  data: any;
  follow?: boolean;
  setFollow?: any;
  noneFollow?: any;
}

const UserCardHover: FC<UserCardHoverProps> = ({ noneFollow, data, follow, setFollow }) => {

  console.log(data);


  return (
    <div className={cx("wrapper")}>
      <div className={cx("header")}>
        <div className={cx("avatar")}>
          <Avatar src={data.avatar} link={data.slug} size={44} />
        </div>
        <div className={cx("infor")}>
          <Link href={`/${data.slug}`} className={cx("username")}>
            <span>{data.slug}</span>
          </Link>

          <div className={cx("fullname")}>
            <span>{data.userName}</span>
          </div>
        </div>
      </div>
      <div className={cx("middle")}>
        <div className={cx("middle_item")}>
          <div className={cx("number")}>
            <span>{data._count.Posts}</span>
          </div>
          <div className={cx("text")}>
            <span>
              <FormattedMessage id="Common.posts" />
            </span>
          </div>
        </div>
        <div className={cx("middle_item")}>
          <div className={cx("number")}>
            <span>{data._count.FollowTo}</span>
          </div>
          <div className={cx("text")}>
            <span>
              <FormattedMessage id="Common.followers" />
            </span>
          </div>
        </div>
        <div className={cx("middle_item")}>
          <div className={cx("number")}>
            <span>{data._count.FollowFrom}</span>
          </div>
          <div className={cx("text")}>
            <span>
              <FormattedMessage id="Common.following" />
            </span>
          </div>
        </div>
      </div>
      <div className={cx("last", `last_${data.Posts.length}`)}>
        {
          data.Posts.map((item: any, index: number) =>
          (
            <div key={`item.${index}}`} className={cx("last_item")}>
              {
                item.typeFile === false ?
                  <img src={item.img} /> :
                  <video

                    playsInline
                    disablePictureInPicture
                    disableRemotePlayback
                    preload="metadata"
                    muted
                    controls={false}
                    controlsList="nofullscreen nodownload noremoteplayback noplaybackrate">
                    <source src={item.img} />
                  </video>
              }
            </div>
          ))}
        {
          data.Posts.length === 0 && (
            <div className={cx("empty_post")}>
              {/* <div className={cx("empty_box")}> */}

              {/* </div> */}
              <EmptyIcon height="62px" width="62px" />
              <span>
                <FormattedMessage id="UserPage.No_posts" />
              </span>
            </div>
          )
        }
      </div>
      {
        noneFollow !== true &&
        <div className={cx("action")}>

          <div className={cx("button")} onClick={setFollow}>
            {follow ? (

              <span>
                <FormattedMessage id="Common.Unfollow" />
              </span>
            ) : (
              <span>
                <FormattedMessage id="Common.Follow" />
              </span>
            )
            }
          </div>
        </div>
      }

    </div>
  );
}
export default UserCardHover;