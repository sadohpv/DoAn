import classNames from "classnames/bind";
import styles from "./CommentCard.module.scss";

import Avatar from "~/components/Avatar/Avatar";

import Link from "next/link";
import TippyCustom from "~/utility/Tippy/TooltipCustom";

import { FormattedMessage, FormattedNumber } from "react-intl";
import { FC, useEffect, useState } from "react";
import ShowMoreText from "react-show-more-text";
import { HeartIcon, HeartIconFill, ThreeDotsIcon } from "~/assets/icon";
import Moment from "react-moment";
import { useSelector } from "react-redux";
import commentServices from "~/services/commentServices";
import Tippy from "@tippyjs/react";
import MentionCustom from "../Mentions/Mention";
import { toast } from "react-toastify";
import reportServices from "~/services/reportServices";

const cx = classNames.bind(styles);

interface CommentCard {
  data?: any;
  likeCheck: boolean;
  deleteCommentCount?: any;
  index?: any;
  taglist?: any;
  reload?: any;
  handleCreateReply?: any;
}
const CommentCard: FC<CommentCard> = ({ reload, handleCreateReply, taglist, index, data, likeCheck = false, deleteCommentCount }) => {
  const [like, setLike] = useState<boolean>(likeCheck);
  const [modal, setModal] = useState<boolean>(false);
  const [likeNumber, setLikeNumber] = useState(data.likeNumber);
  const [confirm, setConfirm] = useState(false);
  const [confirmType, setConfirmType] = useState<boolean | null>(false);
  const [content, setContent] = useState<any>(data.content);
  const [comment, setComment] = useState<any>(data.content);
  const [focus, setFocus] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState(true);
  const [replyInput, setReplyInput] = useState(false);
  const [replyComment, setReplyComment] = useState("");
  const [deleteList, setDeletetList] = useState<any[]>([]);
  const [replyLength, setReplyLength] = useState(data.ComInComs.length ? data.ComInComs.length : 0)
  const [replyModal, setReplyModal] = useState(false);
  const [reportContent, setReportContent] = useState<number[]>([]);

  const language = useSelector<any>(state => state.app.language);
  const idUser = useSelector<any>(state => state.auth.data.id);
  // console.log(data);
  const handleLike = async () => {
    setLike(!like);
    const payload = {
      userId: idUser,
      comId: data.id,
      like: !like,
    }
    await commentServices.toggleLikeComment(payload);

    if (like === false) {
      setLikeNumber(likeNumber + 1)
    } else {
      setLikeNumber(likeNumber - 1)
    }
  };
  const handleOpenCommentAction = () => {
    setModal(!modal);
  }
  const handleDeleteComment = () => {
    setConfirm(!confirm);
    setConfirmType(false);

  }
  const handleEditComment = () => {
    setConfirm(!confirm);
    setConfirmType(null)
    setFocus(true);
  }
  const handleReportComment = () => {
    setConfirm(!confirm);
    setConfirmType(true);
  }
  const handleConfirmDelete = async () => {
    const result = await commentServices.deleteComment(data.id);
    setConfirm(!confirm);
    if (typeof deleteCommentCount === "function") {
      deleteCommentCount();

    }
    setDeleteStatus(false);
  }

  const handleEditApiComment = async () => {
    if (comment !== "") {
      const payload = {
        id: data.id,
        content: comment,
      }
      await commentServices.editComment(payload);
      setConfirm(!confirm);
      setContent(comment);
    }
  }
  const handleCancelComment = () => {
    setConfirm(false);
    if (confirmType === null) {
      setComment(data.content);
    }
  }
  const handleReplyComment = () => {
    setReplyInput(true);
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
        <div key={index} className={cx("tag")}>
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

  const handleCreateReplyApi = async () => {
    if (handleCreateReply) {
      handleCreateReply(data.id, replyComment, setReplyComment);
      setReplyInput(false);
      setReplyLength(replyLength + 1);
    }
  }
  const handleReplyModal = async () => {
    setReplyModal(!replyModal);
  }
  const handleDeleteReply = async (idDelete: any) => {
    setDeletetList([...deleteList, +idDelete])
    setReplyLength(replyLength - 1);
    await commentServices.deleteComInCom(idDelete);
  }

  const handleReasonReport = (value: number) => {
    if (reportContent.includes(value)) {
      const reportTemp = reportContent.filter(number => number !== value);
      setReportContent(reportTemp);
    } else {
      setReportContent([...reportContent, value].sort((a, b) => a - b))
    }
  }
  const handleCreateReport = async () => {
    if (reportContent.length > 0) {
      const payload = {
        commentId: data.id,
        content: reportContent
      }
      const result = await reportServices.handleCreateReport(payload);
      if (result.result) {
        handleCancelComment();
        toast.success(<FormattedMessage id="Report.Report_create_success" />, {
          autoClose: 3000
        })
      } else {
        handleCancelComment();
        toast.error(<FormattedMessage id="Report.Report_create_failed" />, {
          autoClose: 3000
        })
      }
    } else {
      toast.warning(<FormattedMessage id="Report.Has_choose" />, {
        autoClose: 3000
      })
    }

  }
  return (
    <>
      {
        deleteStatus &&
        <>
          <div className={cx("wrapper")}>
            <div className={cx("avatar")}>
              <Avatar size={32} link={data.author.slug} src={data.author.avatar} />
            </div>
            <div className={cx("main")}>
              <div className={cx("content")}>
                <div className={cx("text")}>
                  <ShowMoreText
                    lines={3}
                    more={<FormattedMessage id="Common.ShowMore" />}
                    less={<FormattedMessage id="Common.ShowLess" />}
                    expanded={false}
                    truncatedEndingComponent={"..."}
                    anchorClass={cx("more_less-button")}
                    className={cx("text_more")}
                  >
                    <div>
                      <Link className={cx("name-in-content")} href={`/${data.author.slug}`}>
                        {data.author.userName}
                      </Link>

                      {handleComTag(content)}

                    </div>
                  </ShowMoreText>

                </div>
              </div>
              <div className={cx("infor")}>
                <div className={cx("day")}>
                  <p>
                    <Moment locale={language == 'en' ? 'en' : 'vi'} fromNow>
                      {data.createdAt}
                    </Moment>
                  </p>
                </div>
                <div className={cx("like_number")}>
                  <p>
                    <FormattedNumber
                      notation="compact"
                      maximumFractionDigits={2}
                      value={likeNumber}
                    />
                    <FormattedMessage id="Post.Likes" />
                  </p>
                </div>
              </div>
              <div className={cx("reply_box", replyLength === 0 && replyInput === false && "reply_none")}>
                {
                  replyInput &&
                  <div className={cx("reply_input")}>

                    <MentionCustom tagList={taglist} content={replyComment} handlePushComment={handleCreateReplyApi} setContent={setReplyComment} focus={focus} />

                  </div>
                }
                {
                  data.ComInComs.length > 0 &&
                  data.ComInComs.map((item: any) => (
                    <div key={item.id} className={cx("reply_comment", deleteList.includes(item.id) && "reply_delete")}>
                      <div className={cx("reply_wrapper")}>
                        <div className={cx("avatar")}>
                          <Avatar link={item.author.slug} size={32} src={item.author.avatar} />
                        </div>
                        <div className={cx("reply_infor")}>
                          <div className={cx("reply_text")}>
                            <Link className={cx("reply_name-in-content")} href={`/${item.author.slug}`}>
                              {item.author.userName}
                            </Link>
                            {handleComTag(item.content)}

                          </div>
                          <div className={cx("reply_day")}>
                            <p>
                              <Moment locale={language == 'en' ? 'en' : 'vi'} fromNow>
                                {item.createdAt}
                              </Moment>
                            </p>
                          </div>
                        </div>
                        <div className={cx("action_reply")}>

                          {
                            item.author.id === idUser ?
                              <div className={cx("action_reply-button", "danger")} onClick={handleReplyModal}>
                                <FormattedMessage id="Common.Delete" />
                              </div>
                              :
                              <div className={cx("action_reply-button", "warning")}>
                                <FormattedMessage id="Common.Report" />

                              </div>
                          }
                          {
                            replyModal &&
                            <div className={cx("reply_modal-confirm")}>
                              <div className={cx("reply_modal-confirm-wrapper")}>

                                <div className={cx("reply_confirm-title")}>

                                  <FormattedMessage id="Comment.Delete_comment_message" />
                                </div>
                                <div className={cx("reply_confirm-action")} >
                                  <div className={cx("confirm_action-button")} onClick={() => handleDeleteReply(item.id)}>
                                    <FormattedMessage id="Common.Delete" />
                                  </div>
                                  <div className={cx("confirm_action-button")} onClick={handleReplyModal}>
                                    <FormattedMessage id="Common.Cancel" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          }
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
            <div className={cx("like")}>
              <div
                className={cx("like_button", like && "heartAnimation")}
                onClick={handleLike}
              >
                {like ? (
                  <HeartIconFill width="16px" height="16px" />
                ) : (
                  <HeartIcon width="16px" height="16px" />
                )}
              </div>


              <div className={cx("more_button")} onClick={handleOpenCommentAction}>
                <ThreeDotsIcon width="16px" height="16px" />
                {
                  modal &&
                  <div className={cx("modal", index === 0 && "first")} onMouseLeave={handleOpenCommentAction}>
                    <div className={cx("modal_main")}>

                      <div className={cx("modal_main-button")} onClick={handleReplyComment}>
                        <FormattedMessage id="Common.Reply" />
                      </div>

                      {
                        data.userId !== idUser &&
                        <div className={cx("modal_main-button")} onClick={handleReportComment}>
                          <FormattedMessage id="Common.Report" />
                        </div>
                      }

                      {
                        data.userId === idUser &&
                        <>
                          <div className={cx("modal_main-button")} onClick={handleDeleteComment}>
                            <FormattedMessage id="Common.Delete" />
                          </div>
                          <div className={cx("modal_main-button")} onClick={handleEditComment}>
                            <FormattedMessage id="Common.Edit" />
                          </div>
                        </>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
          {
            confirm &&
            <div className={cx("confirm")}>
              <div className={cx("confirm_main")}>
                <div className={cx("message")}>
                  {
                    confirmType === true &&
                    <div className={cx("delete_modal")}>
                      <div className={cx("report_wrapper")}>
                        <div className={cx("reason")}>
                          <input type="checkbox" onChange={() => handleReasonReport(1)} />
                          <FormattedMessage id="Report.Reason_comment_1" />
                        </div>
                        <div className={cx("reason")}>
                          <input type="checkbox" onChange={() => handleReasonReport(2)} />
                          <FormattedMessage id="Report.Reason_comment_2" />

                        </div>
                        <div className={cx("reason")}>
                          <input type="checkbox" onChange={() => handleReasonReport(3)} />
                          <FormattedMessage id="Report.Reason_comment_3" />

                        </div>
                        <div className={cx("reason")}>
                          <input type="checkbox" onChange={() => handleReasonReport(4)} />
                          <FormattedMessage id="Report.Reason_comment_4" />

                        </div>
                        <div className={cx("reason")}>
                          <input type="checkbox" onChange={() => handleReasonReport(5)} />
                          <FormattedMessage id="Report.Reason_comment_5" />

                        </div>
                        <div className={cx("report_action")}>
                          <div className={cx("report_button")} onClick={handleCreateReport}>
                            <FormattedMessage id="Common.Report" />
                          </div>
                          <div className={cx("report_button", "cancel")} onClick={handleCancelComment}>
                            <FormattedMessage id="Common.Cancel" />
                          </div>
                        </div>
                      </div>

                    </div>



                  }
                  {
                    confirmType === false && <FormattedMessage id="Comment.Delete_comment_message" />
                  }
                  {
                    confirmType === null &&
                    <div className={cx("edit_comment")}>
                      <MentionCustom tagList={taglist} content={comment} handlePushComment={handleEditApiComment} setContent={setComment} focus={focus} />
                    </div>
                  }
                </div>
                <div className={cx("confirm_action")}>
                  {
                    confirmType === null &&
                    <div className={cx("confirm_action-button")} onClick={handleEditApiComment}>
                      <FormattedMessage id="Common.Edit" />
                    </div>
                  }
                  {
                    confirmType === false &&
                    <div className={cx("confirm_action-button")} onClick={handleConfirmDelete}>
                      <FormattedMessage id="Common.Delete" />
                    </div>
                  }
                  {
                    confirmType === true &&
                    <div className={cx("confirm_action-button")} onClick={handleConfirmDelete}>
                      <FormattedMessage id="Common.Report" />
                    </div>
                  }
                  <div className={cx("confirm_action-button")} onClick={handleCancelComment}>

                    <FormattedMessage id="Common.Cancel" />
                  </div>
                </div>

              </div>
            </div>
          }
        </>
      }

    </>

  );
};
export default CommentCard;
