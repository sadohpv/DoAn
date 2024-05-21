"use client";
import React, { FC, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./Candle.module.scss";

const cx = classNames.bind(styles);

interface CandleProps {
  color?: string;
}

const Candle: FC<CandleProps> = ({ color = "white" }) => {
  return (
    <div id="box" className={cx("wrapper")}>
      <div className={cx("candle2", color)}>
        <div className={cx("candle2__body")}>
          <div className={cx("candle2__eyes")}>
            <div className={cx("candle2__eyes-one")}></div>
            <div className={cx("candle2__eyes-two")}></div>
          </div>
        </div>
        <div className={cx("candle2__stick")}></div>
      </div>
      <div className={cx("candle2__fire")}></div>
      <div className={cx("sparkles-one")}></div>
      <div className={cx("sparkles-two")}></div>
    </div>
  );
};

export default Candle;
