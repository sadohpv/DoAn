import { FormattedMessage } from "react-intl";
import styles from "./ChangeAvatar.module.scss";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import useDebounce from "~/utility/Debounce/useDebounce";
import userServices from "~/services/userServices";
import { ToastContainer, toast } from "react-toastify";
import Avatar from "../Avatar/Avatar";
const cx = classNames.bind(styles);

interface Props {
    idUser: any;
    avatar: any;
    setAvatar: any;
}
function ChangeAvatarComp({ idUser, avatar, setAvatar }: Props) {
    // const [currentAvatar, setCurrentAvatar] = useState(avatar ? avatar : "");


    const [file, setFile] = useState<any>("")
    const [preview, setPreview] = useState<any>(false)

    const handleUploadImg = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            setPreview(URL.createObjectURL(e.target.files[0]));
            reader.onloadend = () => {
                setFile(reader.result);
            };
        }
    }
    const handleChangeAvatar = async () => {
        let payload = {
            idUser: idUser,
            img: file
        }
        const result = await userServices.changeAvatar(payload);
        if (result) {
            toast.success(<FormattedMessage id="Settings.Change_data_message_success" />, {
                autoClose: 3000
            })
            setAvatar(preview)
            setPreview(false);
        }
    }
    return (
        <div className={cx("wrapper")}>

            <div className={cx("infor_avatar")}>
                <div className={cx("input_avatar")}>
                    <FormattedMessage id="Post.Select_from_com" />
                    <input onChange={handleUploadImg} title=" " type="file" />
                </div>
                {
                    preview &&
                    <div className={cx("preview_avatar")}>
                        <Avatar src={preview} disableLink size={130} />
                        ( <FormattedMessage id="Settings.Check_change_avatar" /> )
                    </div>
                }
                <div className={cx("current_avatar")}>
                    <Avatar src={avatar} disableLink size={130} />
                    {
                        preview &&
                        <div className={cx("button_save")} onClick={handleChangeAvatar}>
                            <FormattedMessage id="Common.Save" />

                        </div>
                    }
                </div>
            </div>

        
        </div >
    );

}

export default ChangeAvatarComp;
