"use client";
import classNames from "classnames/bind";
import styles from "$app/App.module.scss";

import Avatar from "~/components/Avatar/Avatar";
import { CopyRightIcon } from "~/assets/icon";
// import UserCard from "../UserCard/UserCard";
import { FormattedMessage } from "react-intl";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { SwiperSlide, Swiper } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import UserCardSubmain from "../UserCard/UserCardSubmain";
import { useSelector } from "react-redux";
import { RootState } from "~/redux/store";
import { useEffect, useState } from "react";
import userServices from "~/services/userServices";
// import "swiper/css/autoplay";
const cx = classNames.bind(styles);

const listQuote = [
  {
    id: 1,
    quote: <FormattedMessage id="Quotes.quote_1" />,
  },
  {
    id: 2,
    quote: <FormattedMessage id="Quotes.quote_2" />,
  },
  {
    id: 3,
    quote: <FormattedMessage id="Quotes.quote_3" />,
  },
];

export default function Submain() {
  const userData = useSelector<RootState, any>(state => state.auth.data);
  const [suggestedList, setSuggestedList] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const result = await userServices.getSuggestedFriend(userData.id);
      setSuggestedList(result);
      console.log(result);
    }
    if (userData.id) {

      fetchData();
    }
  }, [userData])
  //  console.log(suggestedList);
  return (
    <div className={cx("sub_main")}>
      <div className={cx("sub_header")}>
        <Avatar
          size={44}
          link={userData.slug}
          src={userData.avatar}
        />
        <div className={cx("header_infor")}>
          <div className={cx("text")}>

            <span>{userData.userName}</span>
          </div>
          <div className={cx("text")}>
            <span>{userData.email}</span>
          </div>
        </div>
      </div>
      <div className={cx("sub_body")}>
        <div className={cx("recommend")}>
          <div className={cx("recommend_title")}>
            <span>
              <FormattedMessage id="Submain.suggested" />
            </span>
          </div>
          <div className={cx("recommend_button")}>
            <span>
              <FormattedMessage id="Submain.see_all" />
            </span>
          </div>
        </div>
        {
          suggestedList.map((item: any) => (

            <UserCardSubmain key={item.id} data={item} />
          ))
        }
      </div>
      <div className={cx("sub_footer")}>
        <div className={cx("sologan")}>
          <Swiper
            spaceBetween={30}
            modules={[Pagination, Autoplay, Navigation]}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            loop
            grabCursor={true}
            effect="coverflow"
          >
            {listQuote.map((item) => (
              <SwiperSlide key={item.id}>
                <div className={cx("quote")}>
                  <span>{item.quote}</span>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className={cx("copyright")}>
          <div className={cx("copyright_icon")}>
            <CopyRightIcon width="14" height="14" />
          </div>
          <div className={cx("copyright_title")}>
            <span>2024 ZOOI FROM KUSAKARI</span>
          </div>
        </div>
      </div>
    </div>
  );
}
