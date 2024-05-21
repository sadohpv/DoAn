import { useRouter } from "next/router";
import classNames from "classnames/bind";
import styles from "$app/post/PostPage.module.scss";
const cx = classNames.bind(styles);

export default function PostPage() {
  return <div className={cx("wrapper")}>
    Not Into This
  </div>;
}
