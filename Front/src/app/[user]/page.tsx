"use client"

import classNames from "classnames/bind";

import { useRouter } from "next/navigation";
import styles from "$app/user/UserPage.module.scss"
import { useEffect, useState } from "react";
import userServices from "~/services/userServices";
import { useSelector } from "react-redux";
import { RootState } from "~/redux/store";
import Avatar from "~/components/Avatar/Avatar";
import { FormattedMessage } from "react-intl";
import { AddFriendIcon, ContentIcon, EmptyIcon, ImageIcon, ThreeDotsIcon, UnfriendIcon, VideoIcon } from "~/assets/icon";
import postServices from "~/services/postServices";
import UserPagePostComp from "~/components/Post/UserPagePost";
import followServices from "~/services/followServices";
import TippyCustom from "~/utility/Tippy/TooltipCustom";
import friendServices from "~/services/friendServices";
const cx = classNames.bind(styles);
export default function UserPage({ params }: { params: { user: string } }) {


  const [dataUserPage, setDataUserPage] = useState<any>({});
  const [listPost, setListPost] = useState<any>([])
  const [follow, setFollow] = useState<any>(null);
  const [followerNumber, setFollowerNumber] = useState<any>(0);
  const [listShow, setListShow] = useState<any>([])
  const [likeList, setLikeList] = useState<any>([])
  const [tab, setTab] = useState<number>(1);
  const [isFriend, setIsFriend] = useState<"REQUIRED" | "ACCEPTED" | boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<boolean>(false);
  const [acceptType, setAcceptType] = useState<boolean>(false);

  const idUser = useSelector<RootState, any>(state => state.auth.data.id);


  const handleFollow = async () => {
    if (follow) {
      setModal(true);
      setModalType(false);
    } else {
      const payload = {
        followFrom: idUser,
        followTo: dataUserPage.id,
        status: true
      }
      const result = await followServices.handleCallApiFollow(payload);
      setFollow(true);
      setFollowerNumber(followerNumber + 1);
    }
  }
  console.log(dataUserPage);
  useEffect(() => {
    async function fetchData() {
      const result = await userServices.getDataForUserPage(params.user, idUser);
      console.log(result);
      setDataUserPage(result);
      setFollowerNumber(result._count.FollowTo)
      if (result.FollowTo.length > 0) {
        setFollow(true);
      } else {
        setFollow(false);
      }
      if (result.FriendTo.length > 0 || result.FriendFrom.length > 0) {
        if (result.FriendTo.length > 0) {
          setIsFriend(result.FriendTo[0].status)
        } else {
          setIsFriend(result.FriendFrom[0].status)
          if (result.FriendFrom[0].status === "REQUIRED") {
            setAcceptType(true);
          }
        }
      } else {
        setIsFriend(true);
      }
    }
    if (idUser) {
      fetchData();
    }
    async function getPost() {
      const postList = await postServices.handleGetGuestPost(params.user, idUser)
      setListPost(postList.dataPost);
      setListShow(postList.dataPost);
      setLikeList(postList.checkLike);
    }
    if (idUser) {
      getPost();
    }
  }, [idUser])
  const handleChangeTab = (value: number) => {
    if (tab !== value) {
      setTab(value);
      switch (value) {
        case 2:
          // const filter = listPost.filter(item=>item.typeFile)
          setListShow(listPost.filter((item: any) => item.typeFile === true))
          break;
        case 3:
          setListShow(listPost.filter((item: any) => item.typeFile === false))

          break;
        default:
          setListShow(listPost);

      }
    }
  }
  const handleMakeFriend = async (value: boolean) => {
    if (value) {
      const payload = {
        userFrom: idUser,
        userTo: dataUserPage.id,
        status: value
      }
      const result = await friendServices.handleCallApiFriend(payload);
      setIsFriend("REQUIRED");
    } else {
      setModal(true);
      setModalType(true);
    }
  }
  const handleUnfriendAndUnfollow = async () => {
    if (modalType) {
      const payload = {
        userFrom: idUser,
        userTo: dataUserPage.id,
        status: false
      }
      console.log(payload);
      const result = await friendServices.handleCallApiFriend(payload);
      if (isFriend === "REQUIRED" || isFriend === "ACCEPTED") {
        setIsFriend(true);
      }
      if (isFriend === true) {
        setIsFriend("REQUIRED");

      }


    } else {
      const payload = {
        followFrom: idUser,
        followTo: dataUserPage.id,
        status: false
      }
      const result = await followServices.handleCallApiFollow(payload);
      setFollow(false);
      setFollowerNumber(followerNumber - 1);
    }
    setModal(false);
  }
  const closeModal = () => {
    setModal(false);
  }

  const handleAcceptFriend = async () => {
    const payload = {
      userFrom: idUser,
      userTo: dataUserPage.id,
      status: true
    }
    const result = await friendServices.handleAcceptFriend(payload);
    if (result) {
      setAcceptType(false);
      setIsFriend("ACCEPTED");
    }
  }
  console.log(idUser);
  return (
    <>
      <div className={cx("wrapper")}>
        <div className={cx("header")}>
          <div className={cx("avatar")}>
            <Avatar disableLink size={150} src={dataUserPage.avatar} />
          </div>
          <div className={cx("infor")}>
            <div className={cx("infor_1")}>
              <div className={cx("name")}>
                {dataUserPage.slug}
              </div>
              <div className={cx("action")}>
                {
                  dataUserPage.id !== idUser &&
                  <div className={cx("follow_button")} onClick={handleFollow}>
                    {
                      follow === true &&
                      <FormattedMessage id="Common.Unfollow" />

                    }
                    {
                      follow === false &&
                      <FormattedMessage id="Common.Follow" />
                    }
                  </div>
                }
                {

                  isFriend === "REQUIRED" && dataUserPage.id !== idUser &&
                  <TippyCustom content={<FormattedMessage id="UserPage.Cancel_add_friend" />}>
                    <div className={cx("suggest_button")} onClick={() => handleMakeFriend(false)}>
                      <UnfriendIcon />
                    </div>
                  </TippyCustom>
                }
                {
                  isFriend === "ACCEPTED" && dataUserPage.id !== idUser &&
                  <TippyCustom content={<FormattedMessage id="UserPage.Unfriend" />}>
                    <div className={cx("suggest_button")} onClick={() => handleMakeFriend(false)}>
                      <UnfriendIcon />
                    </div>
                  </TippyCustom>
                }
                {
                  isFriend === true && dataUserPage.id !== idUser &&
                  <TippyCustom content={<FormattedMessage id="UserPage.Add_Friend" />}>
                    <div className={cx("suggest_button")} onClick={() => handleMakeFriend(true)}>
                      <AddFriendIcon />
                    </div>
                  </TippyCustom>
                }
                {
                  acceptType === true && dataUserPage.id !== idUser &&
                  <TippyCustom content={<FormattedMessage id="UserPage.Accept_add_friend" />}>
                    <div className={cx("suggest_button")} onClick={() => handleAcceptFriend()}>
                      <AddFriendIcon />
                    </div>
                  </TippyCustom>
                }


                <div className={cx("more_button")}>
                  <ThreeDotsIcon />
                </div>
              </div>
            </div>
            <div className={cx("infor_2")}>
              <div className={cx("middle_item")}>
                <div className={cx("number")}>
                  <span>{dataUserPage._count?.Posts}</span>
                </div>
                <div className={cx("text")}>
                  <span>
                    <FormattedMessage id="Common.posts" />
                  </span>
                </div>
              </div>
              <div className={cx("middle_item")}>
                <div className={cx("number")}>
                  <span>{followerNumber}</span>
                </div>
                <div className={cx("text")}>
                  <span>
                    <FormattedMessage id="Common.followers" />
                  </span>
                </div>
              </div>
              <div className={cx("middle_item")}>
                <div className={cx("number")}>
                  <span>{dataUserPage._count?.FollowFrom}</span>
                </div>
                <div className={cx("text")}>
                  <span>
                    <FormattedMessage id="Common.following" />
                  </span>
                </div>
              </div>
            </div>
            <div className={cx("infor_3")}>
              <div className={cx("name")}>
                {dataUserPage.userName}
              </div>
            </div>
          </div>
        </div>
        <div className={cx("body")}>
          <div className={cx("title")}>
            <div className={cx("tile_item", tab === 1 && "title_active")} onClick={() => handleChangeTab(1)}>
              <ContentIcon />
              <FormattedMessage id="Common.Posts" />
            </div>
            <div className={cx("tile_item", tab === 2 && "title_active")} onClick={() => handleChangeTab(2)}>
              <VideoIcon />
              <FormattedMessage id="Common.Videos" />
            </div>
            <div className={cx("tile_item", tab === 3 && "title_active")} onClick={() => handleChangeTab(3)}>
              <ImageIcon />
              <FormattedMessage id="Common.Photos" />
            </div>
          </div>
          <div className={cx("body_main", listShow.length === 0 && "empty")}>
            {
              listShow.map((item: any) => {

                return <UserPagePostComp likeList={likeList} dataUserPage={dataUserPage} key={item.id} data={item} />
              }
              )
            }
            {
              listShow.length === 0 &&
              <div className={cx("empty_post")}>
                <EmptyIcon width="100px" height="100px" />
                {tab === 1 &&
                  <span>
                    <FormattedMessage id="UserPage.No_posts" />

                  </span>
                }
                {tab === 2 &&
                  <span>
                    <FormattedMessage id="UserPage.No_videos" />

                  </span>
                }
                {tab === 3 &&
                  <span>
                    <FormattedMessage id="UserPage.No_photos" />

                  </span>
                }
              </div>
            }
          </div>
        </div>

        <div className={cx("footer")}>

        </div>
      </div >
      {
        modal &&
        <div className={cx("modal_confirm")}>
          <div className={cx("box")}>
            <div className={cx("title")}>
              {
                modalType === true &&
                <>
                  <FormattedMessage id="UserPage.Confirm_unfriend" /> {dataUserPage.userName} ?
                </>

              }
              {
                modalType === false &&
                <>
                  <FormattedMessage id="Submain.Confirm_unfollow" /> {dataUserPage.userName} ?
                </>
              }
            </div>
            <div className={cx("action")}>
              <div className={cx("confirm_action-button")} onClick={handleUnfriendAndUnfollow}>
                {
                  modalType === true
                    ?
                    <>
                      {
                        isFriend === "REQUIRED" ?
                          <>
                            <FormattedMessage id="UserPage.Cancel_add_friend" />
                          </>
                          :
                          <>
                            <FormattedMessage id="UserPage.Unfriend" />
                          </>
                      }
                    </>
                    :
                    <>
                      <FormattedMessage id="UserPage.Unfriend" />
                    </>
                }
                {
                  modalType === false &&

                  <>
                    <FormattedMessage id="Common.Unfollow" />
                  </>
                }
              </div>
              <div className={cx("confirm_action-button")} onClick={closeModal}>

                <FormattedMessage id="Common.Cancel" />
              </div>
            </div>
          </div>
        </div>
      }
    </>
  )
}
