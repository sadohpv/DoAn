"use client"
import classNames from "classnames/bind";
import styles from "$app/settings/SettingFriendPage.module.scss";
import { FormattedMessage } from "react-intl";
import FriendCard from "~/components/Settings/FriendCard";
import { useEffect, useState } from "react";
import friendServices from "~/services/friendServices";
import { useSelector } from "react-redux";
import { IRootState } from "~/redux/reducers/rootReducer";
const cx = classNames.bind(styles);

export default function SettingFriendPage() {
  const idUser = useSelector<IRootState, any>(state => state.auth.data.id);
  const [listData, setListData] = useState<any>([]);
  useEffect(() => {
    async function fetchData() {
      const result = await friendServices.getAllFriend(idUser);
      console.log(result);
      setListData(result.result);
    }
    if (idUser) {
      fetchData();
    }
  }, [idUser])
  return (
    <>
      <div className={cx("wrapper")}>

        {
          listData.map((data: any, index: any) => {
            if (data.UserFrom === null) {
              return (
                <FriendCard key={index} fromOrTo={true} isFriend={data.status === "REQUIRED" ? false : true} idUser={idUser} createAt={data.createdAt} data={data.UserTo} />
              )
            } else {
              return (
                <FriendCard key={index} fromOrTo={false} isFriend={data.status === "REQUIRED" ? false : true} idUser={idUser} createAt={data.createdAt} data={data.UserFrom} />

              )
            }
          }
          )
        }
      </div>
    </>
  )


}
