import styles from "./IsLoading.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

function IsLoading() {
    return (
        <div className={cx("wrapper")}>
            <div className={cx("header")}>
                <div className={cx("avt")}></div>
                <div className={cx("title")}>
                    <div className={cx("title_child")}></div>
                    <div className={cx("title_child")}></div>
                </div>
            </div>
            <div className={cx("img")}>
                <div className={cx("img_box")}></div>
            </div>
            <div className={cx("footer")}>
                <div className={cx("title_child")}></div>
                <div className={cx("title_child")}></div>

            </div>
        </div>
    );
}

export default IsLoading;
