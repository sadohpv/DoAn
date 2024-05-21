import classNames from "classnames/bind";
import styles from "./style/UserCardSubmain.module.scss";

import Avatar from "~/components/Avatar/Avatar";

import Link from "next/link";
import TippyCustom from "~/utility/Tippy/TooltipCustom";
import UserCardHover from "./UserCardHover";
import { FormattedMessage } from "react-intl";
import UserCard from "./UserCard";
import { FC, useState } from "react";
import followServices from "~/services/followServices";
import { useSelector } from "react-redux";
import { RootState } from "~/redux/store";
const cx = classNames.bind(styles);
interface UserCardSubmainProps {
  data: any;

}

const UserCardSubmain: FC<UserCardSubmainProps> = ({ data }) => {

  const [follow, setFollow] = useState(data.FollowTo.length > 0 ? true : false);
  const [modalFollow, setModalFollow] = useState(false);
  const idUser = useSelector<RootState, any>(state => state.auth.data.id);



  const handleFollow = async () => {
    if (follow === false) {
      const payload = {
        followFrom: idUser,
        followTo: data.id,
        status: true
      }
      const result = await followServices.handleCallApiFollow(payload);
   

      setFollow(true);
    } else {
      setModalFollow(true);
    }
  }
  const closeModal = () => {
    setModalFollow(false);

  }
  const handleUnfollow = async () => {
    const payload = {
      followFrom: idUser,
      followTo: data.id,
      status: false
    }
    const result = await followServices.handleCallApiFollow(payload);
  
    setFollow(false);
    setModalFollow(false);

  }
  return (
    <>
      <div className={cx("wrapper")}>
        <div className={cx("main")}>
          <UserCard follow={follow} setFollow={handleFollow} data={data} />
        </div>
        <div className={cx("button_follow")} onClick={handleFollow}>
          {
            follow ?
              <span>
                <FormattedMessage id="Common.Unfollow" />
              </span>
              :
              <span>
                <FormattedMessage id="Common.Follow" />
              </span>
          }
        </div>
      </div>
      {
        modalFollow &&
        <div className={cx("modal_confirm")}>
          <div className={cx("box")}>
            <div className={cx("title")}>
              <FormattedMessage id="Submain.Confirm_unfollow" /> {data.userName} ? <FormattedMessage id="Submain.Confirm_unfollow_message" />
            </div>
            <div className={cx("action")}>
              <div className={cx("confirm_action-button")} onClick={handleUnfollow}>

                <FormattedMessage id="Common.Unfollow" />
              </div>
              <div className={cx("confirm_action-button")} onClick={closeModal}>

                <FormattedMessage id="Common.Cancel" />
              </div>
            </div>
          </div>
        </div>
      }
    </>

  );
}
export default UserCardSubmain;