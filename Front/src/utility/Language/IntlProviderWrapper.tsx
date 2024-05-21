"use client";
import React, { FC, ReactNode, useEffect, useState } from "react";
import { IntlProvider } from "react-intl";

import LanguageUtils from "./LanguageUtils";
import { useDispatch, useSelector } from "react-redux";
import { changeLanguageRedux } from "~/redux/actions/appAction";
import { LANGUAGE } from "../constants/constants";
import "moment/locale/vi";

interface IntlProviderWrapperProps {
  children: ReactNode;
}

const messages = LanguageUtils.getFlattenedMessages();

const IntlProviderWrapper: FC<IntlProviderWrapperProps> = ({ children }) => {
  const language = useSelector((state: any) => state.app.language);
  const dispatch = useDispatch<any>();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (window.localStorage.getItem("language") === LANGUAGE.VI) {
      dispatch(changeLanguageRedux(LANGUAGE.VI));
    } else {
      dispatch(changeLanguageRedux(LANGUAGE.EN));
    }
    setLoading(true);
  }, []);

  return (
    <IntlProvider
      locale={language ? language : "en"}
      messages={language ? messages[language] : messages["en"]}
      defaultLocale={language}
    >
      {loading && <>{children}</>}
    </IntlProvider>
  );
};

export default IntlProviderWrapper;
