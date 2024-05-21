import { useRouter } from "next/router";
import classNames from "classnames/bind";
import styles from "$app/post/PostPage.module.scss";
import NavbarSearch from "~/components/Navbar/NavbarSearch";
import Navbar from "~/components/Navbar/Navbar";
const cx = classNames.bind(styles);

export default function PostPageLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>
        <nav>
            <NavbarSearch />

            <Navbar />
        </nav>
        {children}
    </>;
}
