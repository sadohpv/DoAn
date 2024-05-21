import { FormattedMessage } from "react-intl";
import styles from "./ChangePass.module.scss";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import useDebounce from "~/utility/Debounce/useDebounce";
import userServices from "~/services/userServices";
import { ToastContainer, toast } from "react-toastify";
const cx = classNames.bind(styles);

interface Props {
    idUser: any;
}
function ChangePassComp({ idUser }: Props) {

    const [editPass, setEditPass] = useState(false);
    const [currentPass, setCurrentPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [reNewPass, setReNewPass] = useState("");
    const [rePassNote, setRePassNote] = useState(false);
    const [undone, setUnDone] = useState(false);

    const handleInputCurrentPass = (e: any) => {
        if (undone) {
            setUnDone(false);
        }
        setCurrentPass(e.target.value.trim());
    }
    const handleInputNewPass = (e: any) => {
        if (undone) {
            setUnDone(false);
        }

        setNewPass(e.target.value.trim());
    }
    const handleInputReNewPass = (e: any) => {
        if (rePassNote) {
            setRePassNote(false);
        }
        if (undone) {
            setUnDone(false);
        }
        setReNewPass(e.target.value.trim());
    }
    const handleSetEdit = () => {

        setEditPass(!editPass);
    }

    const debounced = useDebounce(reNewPass, 800);


    useEffect(() => {

        const checkRepeatPassword = async () => {
            if (reNewPass !== newPass) {
                setRePassNote(true);
            }
        };
        checkRepeatPassword();

    }, [debounced]);

    const handleChangePassword = async () => {
        if (currentPass === "" || newPass === "" || reNewPass === "") {
            setUnDone(true);
        } else {
            if (reNewPass === newPass) {
                const payload = {
                    currentPass: currentPass,
                    newPass: newPass,
                    idUser: idUser,
                }
                const result = await userServices.changePassword(payload);
              
                if (result) {

                    if (result.EC === 0) {
                        toast.error(<FormattedMessage id="Settings.Same_pass" />, {
                            autoClose: 3000
                        })
                    } else if (result.EC === 1) {
                        toast.error(<FormattedMessage id="Settings.Not_current_pass" />, {
                            autoClose: 3000
                        })
                    } else if (result.id) {
                        toast.success(<FormattedMessage id="Settings.Change_data_message_success" />, {
                            autoClose: 3000
                        })
                    } else {
                        toast.error(<FormattedMessage id="Settings.Change_data_message_failed" />, {
                            autoClose: 3000
                        })
                    }
                    setEditPass(false);
                    setNewPass("");
                    setReNewPass("");
                    setCurrentPass("");
                } else {
                    toast.error(<FormattedMessage id="Settings.Change_data_message_failed" />, {
                        autoClose: 3000
                    })
                    setEditPass(false);
                    setNewPass("");
                    setReNewPass("");
                    setCurrentPass("");
                }
            } else {
                setRePassNote(true)
            }
        }
    }
    return (
        <div className={cx("wrapper")}>
            <div className={cx("infor_row")}>
                <div className={cx("label")}>
                    <FormattedMessage id="Login.Password" />
                </div>
                <div className={cx("content")}>
                    *********
                </div>
                <div className={cx("change_button", editPass && "cancel_button")} onClick={handleSetEdit}>
                    {
                        editPass ?
                            <FormattedMessage id="Common.Cancel" />
                            :
                            <FormattedMessage id="Common.Edit" />
                    }
                </div>
            </div>
            {
                editPass &&
                <div className={cx("main")}>
                    <div className={cx("input_box")}>
                        <div className={cx("label")}>
                            <FormattedMessage id="Settings.Current_pass" />
                        </div>
                        <input type="password" min={6} value={currentPass} onChange={handleInputCurrentPass} placeholder="Current password" />
                    </div>
                    <div className={cx("input_box")}>
                        <div className={cx("label")}>
                            <FormattedMessage id="Settings.New_pass" />
                        </div>
                        <input type="password" min={6} value={newPass} onChange={handleInputNewPass} placeholder="New password" />
                    </div>
                    <div className={cx("input_box")}>
                        <div className={cx("label")}>
                            <FormattedMessage id="Settings.Re_new_pass" />
                        </div>
                        <input type="password" min={6} value={reNewPass} onChange={handleInputReNewPass} placeholder="Repeat new password" />
                    </div>

                    {
                        rePassNote &&
                        <div className={cx("input_box")}>
                            <span className={cx("check_re_pass")}>
                                (<FormattedMessage id="Settings.Re_new_pass_note" />)
                            </span>
                        </div>
                    }


                    {
                        undone && rePassNote === false &&
                        <div className={cx("input_box")}>
                            <span className={cx("check_re_pass")}>
                                (<FormattedMessage id="Settings.Re_empty_pass_note" />)
                            </span>
                        </div>
                    }

                    <div className={cx("input_box")} >
                        <span className={cx("change_pass_button")} onClick={handleChangePassword}>
                            <FormattedMessage id="Common.Save" />
                        </span>
                    </div>

                </div>
            }
          
        </div >
    );
}

export default ChangePassComp;
