import classNames from "classnames/bind";
// import styles from "~/styles/app/user/Layout.module.scss";
import styles from "$app/user/Layout.module.scss"
import NavbarSearch from "~/components/Navbar/NavbarSearch";
import Navbar from "~/components/Navbar/Navbar";
const cx = classNames.bind(styles);

function LayoutUserPage({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <nav>
        <NavbarSearch />

        <Navbar />
      </nav>
      <div className={cx("wrapper")}>
        <div className={cx("main")}>{children}</div>
      </div>
    </>
  );
}

export default LayoutUserPage;
