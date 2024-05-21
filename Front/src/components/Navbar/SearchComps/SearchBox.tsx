import { FC, useEffect, useState } from "react"
import styles from "./SearchBox.module.scss";
import classNames from "classnames/bind";
import useDebounce from "~/utility/Debounce/useDebounce";
import userServices from "~/services/userServices";
import Avatar from "~/components/Avatar/Avatar";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";
import { RootState } from "~/redux/store";
import Link from "next/link";
import { EmptyIcon, WonderIcon } from "~/assets/icon";
const cx = classNames.bind(styles);

interface SearchBoxProps {

}

const SearchBox: FC<SearchBoxProps> = ({ }) => {

    const [keyWord, setKeyWord] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const idUser = useSelector<RootState, any>(state => state.auth.data.id);

    const handleOnSearch = (e: any) => {
        const searchValueCurrent = e.target.value;
        if (!searchValueCurrent.startsWith(" ")) {
            setKeyWord(searchValueCurrent);
        }
    }

    const debounced = useDebounce(keyWord, 800);
    useEffect(() => {
        if (!keyWord.trim()) {
            setSearchResult([]);
            return;
        }
        const fetchApi = async () => {
            const results = await userServices.handleSearchUser(debounced, idUser);
            setSearchResult(results);
            console.log(results);
        };
        fetchApi();

    }, [debounced]);

    return (
        <>
            <div className={cx("wrapper")}>
                <div className={cx("input")}>
                    <input
                        value={keyWord}
                        spellCheck={false}
                        onChange={(e) => handleOnSearch(e)} placeholder="Someone you wanna find !!!" />
                </div>
                <div className={cx("main")}>
                    {
                        searchResult.length > 0 ?
                            searchResult.map((item: any) => (
                                <div className={cx("item_search")} key={item.id}>
                                    <div className={cx("avatar")}>
                                        <Avatar src={item.avatar} link={item.slug} size={40} />
                                    </div>
                                    <div className={cx("infor")}>
                                        <Link href={item.slug} className={cx("name")}>
                                            {item.userName}
                                        </Link>
                                        <Link href={item.slug} className={cx("")}>
                                            {item.slug}
                                        </Link>
                                    </div>
                                    <div className={cx("action")}>
                                        {
                                            item.FollowTo.length > 0 &&
                                            <span  >
                                                <FormattedMessage id="Common.Followed" />
                                            </span>
                                        }
                                    </div>
                                </div>
                            ))
                            :
                            (
                                keyWord !== "" ?
                                    <div className={cx("empty_search")}>
                                        <EmptyIcon height="76px" width="76px" />
                                        <FormattedMessage id="Search.Not_found" />

                                    </div>
                                    :
                                    <div className={cx("empty_search")}>
                                        <WonderIcon height="106px" width="106px" />
                                        <FormattedMessage id="Search.No_keyword" />

                                    </div>
                            )
                    }
                </div>
            </div >
        </>
    )
}
export default SearchBox;