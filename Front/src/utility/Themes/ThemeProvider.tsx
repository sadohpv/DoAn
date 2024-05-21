"use client";
import { FC, useEffect, useState } from "react";
import "../../app/globals.css";
import { useDispatch, useSelector } from "react-redux";
import { changeThemeRedux } from "~/redux/actions/appAction";
import { THEME } from "../constants/constants";

interface ThemeProviderWrapperProps {
  children: React.ReactNode;
}

const ThemeProviderWrapper: FC<ThemeProviderWrapperProps> = ({ children }) => {
  const dispatch = useDispatch<any>();
  const theme = useSelector((state: any) => state.app.theme);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (window.localStorage.theme === THEME.LIGHT) {
      dispatch(changeThemeRedux(THEME.LIGHT));
    } else {
      dispatch(changeThemeRedux(THEME.DARK));
    }
    setLoading(true);

  });

  return <div className={`theme-${theme}`}>{loading === true && <>{children}</>}</div>;
};

export default ThemeProviderWrapper;
