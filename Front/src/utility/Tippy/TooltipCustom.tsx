import Tippy, { TippyProps } from "@tippyjs/react";
import React, { ReactNode, ReactElement } from "react";
import "tippy.js/animations/scale.css";
import "tippy.js/dist/tippy.css";
import "./TippyCustom.css";
interface TippyCustomProps {
  children: ReactElement;
  content: string | ReactElement;
  place?: "top" | "bottom" | "left" | "right" | "auto" |"bottom-start";
  haveClick?: boolean;
  theme?: undefined | string;
}

const TippyCustom: React.FC<TippyCustomProps> = ({
  children,
  content,
  place = "auto",
  haveClick = false,
  theme = "",
}) => {
  return (
    <Tippy
      content={content}
      arrow={false}
      placement={place}
      animation={"scale"}
      // trigger={haveClick === true ? "click" : "mouseenter"}
      zIndex={99}
      interactive={haveClick}
      // popperOptions={['bottom', 'right']}
      theme={theme}
      
    >
      {children}
    </Tippy>
  );
};
export default TippyCustom;
