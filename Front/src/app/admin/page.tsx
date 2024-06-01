"use client"
import classNames from "classnames/bind";
import styles from "$app/admin/AdminPage.module.scss";
import { useEffect, useState } from "react";
import React from 'react';
import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import AutoSizer from 'react-virtualized-auto-sizer';
import Avatar from "~/components/Avatar/Avatar";
import { FormattedMessage } from "react-intl";
import reportServices from "~/services/reportServices";
import useDebounce from "~/utility/Debounce/useDebounce";
import Moment from "react-moment";
import { useSelector } from "react-redux";
import TippyCustom from "~/utility/Tippy/TooltipCustom";
import { ChooseIcon, EmptyIcon } from "~/assets/icon";
import { tree } from "next/dist/build/templates/app-page";
import { ToastContainer, toast } from "react-toastify";
import { InfinitySpin } from "react-loader-spinner";
const cx = classNames.bind(styles);

export default function AdminPage({ params }: { params: { user: string } }) {
    const [detailId, setDetailId] = useState<number>(0);
    const [loading, setLoading] = useState<boolean | null>(null);
    const [listUser, setListUser] = useState<any[]>([]);
    const [listUserCache, setListUserCache] = useState<any[]>([]);
    const [banPost, setBanPost] = useState<boolean>(false);
    const [banComment, setBanComment] = useState<boolean>(false);
    const [banUser, setBanUser] = useState<boolean>(false);
    const [detailData, setDetailData] = useState<any>({});
    const [keyword, setKeyword] = useState("");
    const [unbanModal, setUnbanModal] = useState(false);
    const [bandType, setBanType] = useState<"COMMENT" | "POST" | "ACCOUNT" | "NONE">("NONE");
    const [password, setPassword] = useState("");
    const [waitBan, setWaitBan] = useState(false);
    const language = useSelector<any>(state => state.app.language);


    const isItemLoaded = (index: number) => index < listUser.length;
    const loadMoreItems = true ? () => {
        console.log("Loading")
    } : () => {
        console.log("Stop Loading")
    };

    useEffect(() => {
        async function fetchData() {
            const result = await reportServices.handleGetDataUserForAdmin();
            console.log(result);
            setListUser(result.result);
            setListUserCache(result.result);
        }
        fetchData();
    }, [])

    const debounced = useDebounce(keyword, 800);
    const checkFilterListUser = async () => {
        if (keyword === "") {
            setListUser(listUserCache);
        } else {
            const filterList = listUserCache.filter(item => item.userName.includes(keyword) || item.slug.includes(keyword))
            setListUser(filterList);
        }
    };
    useEffect(() => {
        checkFilterListUser();
    }, [debounced]);
    const handleSearchUser = (e: any) => {
        setKeyword(e.target.value);
    }

    const handleDetailShow = (value: number) => {
        setDetailId(value)

    }
    async function getReportDetail() {
        setLoading(false);

        const result = await reportServices.handleGetReportUser(detailId);
        if (result.result) {

            setDetailData({
                total: Object.values(result.result.count),
                list: result.result.report,
                user: result.result.user
            })
            setCurrentBan(result.result.user.ban);
            setLoading(true);
        } else {
            setLoading(null);
            toast.success(<FormattedMessage id="Report.Report_create_failed" />, {
                autoClose: 3000
            })
        }

    }
    const setCurrentBan = (ban: any) => {
        setBanUser(ban.includes("ACCOUNT"));
        setBanPost(ban.includes("POST"));
        setBanComment(ban.includes("COMMENT"));
    }
    useEffect(() => {
        if (detailId !== 0) {
            getReportDetail();
        }
    }, [detailId])
    const handleSortUser = () => {
        const sortedList = listUser;
        sortedList.sort((a: any, b: any) => b.reportUserNumber - a.reportUserNumber);
        setListUser([...sortedList]);
    }
    const handleSortKindReport = () => {
        const sortedList = listUser;
        sortedList.sort((a: any, b: any) => b.ban.length - a.ban.length);
        setListUser([...sortedList]);
    }
    const handleSortBanAccount = () => {
        const sortedList = listUser; 
        sortedList.sort((a: any, b: any) => {
            const aHasAccountBan = a.ban.includes("ACCOUNT");
            const bHasAccountBan = b.ban.includes("ACCOUNT");
            if (aHasAccountBan && !bHasAccountBan) {
                return -1; 
            } else if (!aHasAccountBan && bHasAccountBan) {
                return 1; 
            } else {
                return 0; 
            }
        });
        setListUser([...sortedList]);
    }
    const handleBanPost = async (id: number) => {
        setWaitBan(true);
        const payload = {
            idUser: id,
            status: !banPost,
            password: password,
        }
        const result = await reportServices.handleBanPost(payload);
        if (result.result) {
            toast.success(<FormattedMessage id="Settings.Change_data_message_success" />, {
                autoClose: 3000
            })
            setListUser(listUser.filter(item => {
                if (item.id === id) {
                    if (!banPost) {
                        item.ban = item.ban.concat(" POST");
                    } else {
                        item.ban = item.ban.replace("POST", "");
                    }
                }
                return item;
            }))
            setListUserCache(listUserCache.filter(item => {
                if (item.id === id) {
                    if (!banPost) {
                        item.ban = item.ban.concat(" POST");
                    } else {
                        item.ban = item.ban.replace("POST", "");
                    }
                }
                return item;
            }));
            setBanPost(!banPost);
        } else if (result.result === null) {
            toast.error(<FormattedMessage id="Report.Wrong_pass" />, {
                autoClose: 3000
            })
        } else {
            toast.error(<FormattedMessage id="Settings.Change_data_message_failed" />, {
                autoClose: 3000
            })
        }
        handleOpenUnbanModal("NONE");
    }
    const handleBanUser = async (id: number) => {
        setWaitBan(true);
        const payload = {
            idUser: id,
            status: !banUser,
            password: password,

        }
        const result = await reportServices.handleBanUser(payload);
        if (result.result) {
            toast.success(<FormattedMessage id="Settings.Change_data_message_success" />, {
                autoClose: 3000
            })
            setListUser(listUser.filter(item => {
                if (item.id === id) {
                    if (!banUser) {
                        item.ban = item.ban.concat(" ACCOUNT");
                    } else {
                        item.ban = item.ban.replace("ACCOUNT", "");
                    }
                }
                return item;
            }))
            setListUserCache(listUserCache.filter(item => {
                if (item.id === id) {
                    if (!banUser) {
                        item.ban = item.ban.concat(" ACCOUNT");
                    } else {
                        item.ban = item.ban.replace("ACCOUNT", "");
                    }
                }
                return item;
            }));
            setBanUser(!banUser);
        } else if (result.result === null) {
            toast.error(<FormattedMessage id="Report.Wrong_pass" />, {
                autoClose: 3000
            })
        } else {
            toast.error(<FormattedMessage id="Settings.Change_data_message_failed" />, {
                autoClose: 3000
            })
        }
        handleOpenUnbanModal("NONE");

    }
    const handleBanComment = async (id: number) => {
        setWaitBan(true);

        const payload = {
            idUser: id,
            status: !banComment,
            password: password,
        }
        const result = await reportServices.handleBanComment(payload);
        if (result.result) {
            toast.success(<FormattedMessage id="Settings.Change_data_message_success" />, {
                autoClose: 3000
            })
            setListUser(listUser.filter(item => {
                if (item.id === id) {
                    if (!banComment) {
                        item.ban = item.ban.concat(" COMMENT");
                    } else {
                        item.ban = item.ban.replace("COMMENT", "");
                    }
                }
                return item;
            }))
            setListUserCache(listUserCache.filter(item => {
                if (item.id === id) {
                    if (!banComment) {
                        item.ban = item.ban.concat(" COMMENT");
                    } else {
                        item.ban = item.ban.replace("COMMENT", "");
                    }
                }
                return item;
            }));
            setBanComment(!banComment);

        } else if (result.result === null) {
            toast.error(<FormattedMessage id="Report.Wrong_pass" />, {
                autoClose: 3000
            })
        } else {
            toast.error(<FormattedMessage id="Settings.Change_data_message_failed" />, {
                autoClose: 3000
            })
        }
        handleOpenUnbanModal("NONE");
    }

    const handleOpenUnbanModal = (value: "COMMENT" | "POST" | "ACCOUNT" | "NONE") => {
        if (value === "NONE") {
            setUnbanModal(false)
            setWaitBan(false);
        } else {
            setUnbanModal(true)
        }
        setBanType(value)
        setPassword("");
    }

    const handleChangePassword = (e: any) => {
        setPassword(e.target.value.trim());
    }
    const handleCallApiBan = (id: number) => {
        if (password === "") {
            toast.error(<FormattedMessage id="Report.Empty_pass" />, {
                autoClose: 3000
            })
        } else {
            switch (bandType) {
                case "ACCOUNT":
                    handleBanUser(id);
                    break
                case "COMMENT":
                    handleBanComment(id);
                    break
                case "POST":
                    handleBanPost(id);
                    break
                default:
                    console.log("no match");
            }
        }
    }
    return (
        <>
            <div className={cx("wrapper")}>
                <div className={cx("filter")}>
                    <input type="text" placeholder="Search user" value={keyword} onChange={(e) => handleSearchUser(e)} />
                    <div className={cx("sort_button")} onClick={handleSortUser}>
                        Sort by report user
                    </div>
                    <div className={cx("sort_button")} onClick={handleSortKindReport}>
                        Sort by number kind report
                    </div>
                    <div className={cx("sort_button")} onClick={handleSortBanAccount}>
                        Sort by ban account
                    </div>
                </div>

                <AutoSizer className={cx("auto_size")}>
                    {({ height, width }) => (
                        <InfiniteLoader
                            isItemLoaded={isItemLoaded}
                            itemCount={listUser.length}
                            loadMoreItems={loadMoreItems}
                        >

                            {({ onItemsRendered, ref }) => (
                                <List

                                    ref={ref}
                                    onItemsRendered={onItemsRendered}
                                    height={height}
                                    itemCount={listUser.length}
                                    itemSize={70}
                                    width={width}
                                    className={cx("list")}
                                >
                                    {({ index, style }) => {
                                        return (
                                            <div key={listUser[index].id} style={style} className={cx("item")}>
                                                <div className={cx("avatar")}>
                                                    <Avatar size={40} link={listUser[index].slug} src={listUser[index].avatar} />
                                                </div>
                                                <div className={cx("name", "text")}>
                                                    {listUser[index].userName}
                                                </div>
                                                <div className={cx("report_number", "text")}>
                                                    {listUser[index].slug}
                                                </div>
                                                <div className={cx("report_number", "gender")}>
                                                    {
                                                        listUser[index].gender ?
                                                            < FormattedMessage id="Common.Male" />
                                                            :
                                                            < FormattedMessage id="Common.Female" />

                                                    }
                                                </div>
                                                <div className={cx("infor")}>
                                                    <div className={cx("infor_item")}>
                                                        <span>
                                                            {listUser[index].countPost}

                                                        </span>
                                                        <FormattedMessage id="Common.Posts" />
                                                    </div>
                                                    <div className={cx("infor_item")}>
                                                        <span>
                                                            {listUser[index].countFollowed}

                                                        </span>
                                                        <FormattedMessage id="Common.Followed" />

                                                    </div>
                                                    <div className={cx("infor_item")}>
                                                        <span>
                                                            {listUser[index].countFollowing}

                                                        </span>
                                                        <FormattedMessage id="Common.Following" />

                                                    </div>
                                                </div>
                                                <div className={cx("report_number", listUser[index].ban.includes("ACCOUNT") && "ban_status")}>
                                                    <div className={cx("number")}>
                                                        {listUser[index].reportUserNumber}
                                                    </div>
                                                    <FormattedMessage id="Common.Report" />
                                                </div>
                                                <div className={cx("report_number", listUser[index].ban.includes("POST") && "ban_status")}>
                                                    <div className={cx("number")}>
                                                        {listUser[index].reportPostNumber}
                                                    </div>
                                                    <FormattedMessage id="Common.Report_post" />
                                                </div>
                                                <div className={cx("report_number", listUser[index].ban.includes("COMMENT") && "ban_status")}>
                                                    <div className={cx("number")}>
                                                        {listUser[index].reportCommentNumber}
                                                    </div>
                                                    <FormattedMessage id="Common.Report_comment" />
                                                </div>
                                                <div className={cx("report_number", "function")} onClick={() => handleDetailShow(listUser[index].id)}>
                                                    <div className={cx("action")} >
                                                        <FormattedMessage id="Common.Detail" />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }}
                                </List>
                            )}
                        </InfiniteLoader >
                    )}
                </AutoSizer>


                <div className={cx("report_list")}>
                    {
                        loading === null ?
                            <>
                                <div className={cx("choose_some_one")}>
                                    <ChooseIcon width="100px" height="100px" />
                                    <span>
                                        <FormattedMessage id="Report.Choose_some_one" />
                                    </span>
                                </div>
                            </>

                            :
                            (loading ?
                                <>
                                    <div className={cx("report_wrapper")}>
                                        <div className={cx("report_header")}>
                                            <div className={cx("avatar")}>
                                                <Avatar link={detailData.user.slug} src={detailData.user.avatar} size={50} />
                                            </div>
                                            <div className={cx("text")}>
                                                <span className={cx("name")}>
                                                    {detailData.user.userName}
                                                </span>
                                                <span>
                                                    {detailData.user.slug}
                                                </span>
                                            </div>
                                            <div className={cx("text")}>
                                                <span className={cx("name")}>
                                                    <Moment locale={language == 'en' ? 'en' : 'vi'} fromNow>
                                                        {detailData.user.createdAt}
                                                    </Moment>
                                                </span>
                                                <span>
                                                    {detailData.user.email}
                                                </span>
                                            </div>
                                            <div className={cx("report_action")}>

                                                <div className={cx("report_action-button", banUser && "unban")} onClick={() => handleOpenUnbanModal("ACCOUNT")}>
                                                    {
                                                        banUser ?
                                                            <FormattedMessage id="Report.Unban_user" />
                                                            :
                                                            <FormattedMessage id="Report.Ban_user" />
                                                    }
                                                </div>
                                                <div className={cx("report_action-button", banPost && "unban")} onClick={() => handleOpenUnbanModal("POST")}>
                                                    {
                                                        banPost ?
                                                            <FormattedMessage id="Report.Unban_post" />
                                                            :
                                                            <FormattedMessage id="Report.Ban_post" />
                                                    }
                                                </div>
                                                <div className={cx("report_action-button", banComment && "unban")} onClick={() => handleOpenUnbanModal("COMMENT")}>
                                                    {
                                                        banComment ?
                                                            <FormattedMessage id="Report.Unban_comment" />
                                                            :
                                                            <FormattedMessage id="Report.Ban_comment" />
                                                    }
                                                </div>
                                                {
                                                    unbanModal &&
                                                    <div className={cx("unban_modal")}>

                                                        <div className={cx("confirm_unban")}>
                                                            {
                                                                waitBan ?
                                                                    <>
                                                                        <InfinitySpin color="var(--primary-color)" />
                                                                    </>
                                                                    :
                                                                    <>
                                                                        <div className={cx("confirm_unban-title")}>
                                                                            <FormattedMessage id="Report.Enter_your_pass_to_next" />
                                                                        </div>
                                                                        <div className={cx("confirm_unban-input")}>
                                                                            <input placeholder="Enter password" type="password" value={password} onChange={(e) => handleChangePassword(e)} />
                                                                        </div>
                                                                        <div className={cx("confirm_unban-action")}>
                                                                            <div className={cx("unban_ok")} onClick={() => handleCallApiBan(detailData.user.id)}>
                                                                                <FormattedMessage id="Common.Confirm" />
                                                                            </div>
                                                                            <div className={cx("unban_ok", "unban_cancel")} onClick={() => handleOpenUnbanModal("NONE")}>
                                                                                <FormattedMessage id="Common.Cancel" />
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                            }

                                                        </div>

                                                    </div>
                                                }
                                            </div>
                                        </div>
                                        <div className={cx("report_body")}>
                                            <div className={cx("report_total")}>
                                                {
                                                    detailData.total.map((detailTotal: any, index: any) => {

                                                        return (
                                                            <div key={`rule_${index}`} className={cx("report_total-item")}>
                                                                <span className={cx("number", detailTotal === 0 && "clean")}>
                                                                    {detailTotal}
                                                                </span>
                                                                <span>
                                                                    <FormattedMessage id={`Report.Reason_user_${index + 1}`} />
                                                                </span>
                                                            </div>
                                                        )

                                                    })
                                                }
                                            </div>
                                            <div className={cx("report_detail")}>
                                                <div className={cx("report_detail-list")}>
                                                    {detailData.list.length > 0 &&
                                                        detailData.list.map((item: any, index: any) => {
                                                            return (
                                                                <div key={item.id} className={cx("report_list-item")}>
                                                                    <TippyCustom content={item.UserReport.userName}>

                                                                        <div className={cx("avatar_report")}>
                                                                            <Avatar link={item.UserReport.slug} size={32} src={item.UserReport.avatar} />
                                                                        </div>
                                                                    </TippyCustom>
                                                                    <span className={cx("rule_number")}>
                                                                        <FormattedMessage id={`Report.Reason_user_${item.content}`} />
                                                                    </span>
                                                                    <p>
                                                                        <Moment locale={language == 'en' ? 'en' : 'vi'} fromNow>
                                                                            {item.createdAt}
                                                                        </Moment>
                                                                    </p>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                    {
                                                        (detailData.list.length === 0 || !detailData.list) &&
                                                        <div className={cx("empty_report")}>
                                                            <EmptyIcon fill="green" height="100px" width="100px" />
                                                            <span className={cx("empty_report-text")}>
                                                                <FormattedMessage id={`Report.User_clean`} />
                                                            </span>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                                :
                                <div className={cx("choose_some_one")}>
                                    <InfinitySpin color="var(--primary-color)" />
                                </div>
                            )}
                </div>
            </div >
            <ToastContainer />
        </>

    )
}