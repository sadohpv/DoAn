"use client"
import classNames from "classnames/bind";
import styles from "$app/settings/SettingPage.module.scss";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";
import { IRootState } from "~/redux/reducers/rootReducer";
import { ChangeEvent, useEffect, useState } from "react";
import userServices from "~/services/userServices";
import { ToastContainer, toast } from "react-toastify";
import ChangePassComp from "~/components/Settings/ChangePass";
import ChangeAvatarComp from "~/components/Settings/ChangeAvatar";
const cx = classNames.bind(styles);

export default function SettingPage() {

  const idUser = useSelector<IRootState, any>(state => state.auth.data.id);


  const [data, setData] = useState<any>({});
  const [userName, setUserName] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState(false);
  const [editInput, setEditInput] = useState(0);
  const [avatar, setAvatar] = useState("");


 
  async function fetchData() {
    const result = await userServices.getDataForSetting(idUser);
    setData(result)
    setUserName(result.userName);
    setAddress(result.address);
    setGender(result.gender)
    setAvatar(result.avatar);
  }
  useEffect(() => {

    if (idUser) {
      fetchData();
    }
  }, [idUser])

  const toggleSetEditInput = (value: number) => {
    if (value === editInput) {
      setEditInput(0);

    } else {
      setEditInput(value);
      switch (value) {
        case 1:
          setAddress(data.address);
          setGender(data.gender);

          break;
        case 2:
          setUserName(data.userName);
          setGender(data.gender);
          break;
        case 3:
          setUserName(data.userName);
          setAddress(data.address);

          break;
      }
    }
  }
  const handleEditUserName = (e: ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  }
  const handleEditAddress = (e: ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  }
  const handleChangeGender = () => {
    setGender(!gender);
  }
  const handleCopy = () => {
    const linkCopy = process.env.domain + `${data.slug}`;
    navigator.clipboard.writeText(linkCopy);
  }
  const handleSave = () => {
    switch (editInput) {
      case 1:
        if (userName !== data.userName) {
          setUserName(userName);
          handleCallApiChangeDataUser(editInput, userName)

        } else {
          setUserName(data.userName);
        }
        setEditInput(0);
        break;
      case 2:
        if (address !== data.address) {
          setAddress(address);
          handleCallApiChangeDataUser(editInput, address)

        } else {
          setAddress(data.address);
        }
        setEditInput(0);
        break;
      case 3:
        if (gender !== data.gender) {
          setGender(gender);
          handleCallApiChangeDataUser(editInput, gender)
        } else {
          setGender(data.gender);
        }
        setEditInput(0);
        break;
    }
  }

  const handleCallApiChangeDataUser = async (editId: any, data: any) => {
    const payload = {
      editId: editId,
      data: data,
    }
    const result = await userServices.patchDataUser(payload, idUser);
    console.log("Result :", result)
    if (result) {
      toast.success(<FormattedMessage id="Settings.Change_data_message_success" />, {
        autoClose: 3000
      })
      fetchData();
    } else {
      toast.error(<FormattedMessage id="Settings.Change_data_message_failed" />, {
        autoClose: 3000
      })
      setUserName(data.userName);
      setAddress(data.address);
      setGender(data.gender)
    }
  }

  return (
    <>
      <div className={cx("wrapper")}>
        <div className={cx("note")}>
          ( <FormattedMessage id="Login.This_is_unique" /> )
        </div>
        <div className={cx("infor_row")}>
          <div className={cx("label")}>
            <FormattedMessage id="Login.Email" />
          </div>
          <div className={cx("content")}>
            {data.email}
          </div>

        </div>

        <div className={cx("infor_row")}>
          <div className={cx("label")}>
            <FormattedMessage id="Login.Phonenumber" />
          </div>
          <div className={cx("content")}>
            {data.phoneNumber}
          </div>
        </div>
        <div className={cx("infor_row")}>
          <div className={cx("label")}>
            <FormattedMessage id="Common.Slug" />
          </div>
          <div className={cx("content")}>
            {data.slug}
          </div>
          <div className={cx("change_button")} onClick={handleCopy}>
            <FormattedMessage id="Common.Copy" />
          </div>
        </div>

        <div className={cx("line")}></div>


        <div className={cx("infor_row")}>
          <div className={cx("label")}>
            <FormattedMessage id="Login.Username" />
          </div>
          <div className={cx("content")}>
            {
              editInput === 1 ?
                <input autoFocus className={cx("input_box")} value={userName} onChange={(e) => handleEditUserName(e)} />
                :
                <>
                  {userName}
                </>
            }
          </div>


          {
            editInput === 1 &&
            <div className={cx("change_button")} onClick={handleSave}>
              <FormattedMessage id="Common.Save" />
            </div>
          }


          <div className={cx("change_button", editInput === 1 && "cancel_button")} onClick={() => toggleSetEditInput(1)}>
            {
              editInput === 1 ?
                <FormattedMessage id="Common.Cancel" />
                :
                <FormattedMessage id="Common.Edit" />
            }
          </div>
        </div>



        <div className={cx("infor_row")}>
          <div className={cx("label")}>
            <FormattedMessage id="Login.Address" />
          </div>
          <div className={cx("content")}>

            {
              editInput === 2 ?
                <input autoFocus className={cx("input_box")} value={address} onChange={(e) => handleEditAddress(e)} />
                :
                <>
                  {address}
                </>
            }
          </div>
          {
            editInput === 2 &&
            <div className={cx("change_button")} onClick={handleSave}>
              <FormattedMessage id="Common.Save" />
            </div>
          }
          <div className={cx("change_button", editInput === 2 && "cancel_button")} onClick={() => toggleSetEditInput(2)}>
            {
              editInput === 2 ?
                <FormattedMessage id="Common.Cancel" />
                :
                <FormattedMessage id="Common.Edit" />
            }
          </div>
        </div>

        <div className={cx("infor_row")}>
          <div className={cx("label")}>
            <FormattedMessage id="Login.Gender" />
          </div>
          <div className={cx("content")}>

            {
              editInput === 3 ?
                <div className={cx("gender_change")}>
                  <span className={cx("gender", gender === true && "gender_active")} onClick={handleChangeGender}>
                    <FormattedMessage id="Common.Male" />
                  </span>
                  <span className={cx("gender", gender === false && "gender_active")} onClick={handleChangeGender}>
                    <FormattedMessage id="Common.Female" />
                  </span>
                </div>
                :
                <>
                  {gender ? <FormattedMessage id="Common.Male" /> : <FormattedMessage id="Common.Female" />}
                </>
            }


          </div>
          {
            editInput === 3 &&
            <div className={cx("change_button")} onClick={handleSave}>
              <FormattedMessage id="Common.Save" />
            </div>
          }
          <div className={cx("change_button", editInput === 3 && "cancel_button")} onClick={() => toggleSetEditInput(3)}>
            {
              editInput === 3 ?
                <FormattedMessage id="Common.Cancel" />
                :
                <FormattedMessage id="Common.Edit" />
            }
          </div>
        </div>

        <div className={cx("line")}></div>

        <ChangePassComp idUser={idUser} />

        <div className={cx("line")}></div>

        <ChangeAvatarComp idUser={idUser} avatar={avatar} setAvatar={setAvatar} />


      </div>
      <ToastContainer />
    </>
  )
}
