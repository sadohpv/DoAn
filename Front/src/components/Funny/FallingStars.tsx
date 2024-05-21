"use client";
import React, { FC, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./FallingStars.module.scss";

const cx = classNames.bind(styles);

interface FallingStarsProps {}

const FallingStars: FC<FallingStarsProps> = () => {
  useEffect(() => {
    function randomText() {
      var text = ["Truong Anh"];
      let letter = text[Math.floor(Math.random() * text.length)];
      return letter;
    }
    function stars() {
      let box = document.getElementById("box");
      let e = document.createElement("div");
      e.setAttribute("class", cx("star"));
      box?.appendChild(e);
      e.style.left = Math.random() * +innerWidth + "px";
      let size = Math.random() * 12;
        // e.innerText = randomText();
      e.style.fontSize = 20 + size + "px";
      let duration = Math.random() * 5;
      e.style.animationDuration = 5 + duration + "s";
      setTimeout(function () {
        box?.removeChild(e);
      }, 10000);
    }

    setInterval(function () {
      stars();
    }, 1000);
  }, []);
  return <div id="box" className={cx("wrapper")}></div>;
};

export default FallingStars;
