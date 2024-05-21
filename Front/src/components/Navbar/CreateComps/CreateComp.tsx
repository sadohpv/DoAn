"use client";
import Link from "next/link";
import classNames from "classnames/bind";
import styles from "./CreateComp.module.scss";
import { BackIcon, CameraIcon, CreateIcon, EarthIcon, LockIcon } from "~/assets/icon";
import { usePathname } from "next/navigation";
import { FC, useState, useEffect, useRef, ChangeEvent } from "react";
import TippyCustom from "~/utility/Tippy/TooltipCustom";
import { toast } from 'react-toastify';
import { InfinitySpin } from 'react-loader-spinner'
import { FormattedMessage } from "react-intl";
import { STEP } from "~/utility/constants/constants";
import CropImage from "./CropImage";
import getCroppedImg from './cropImg'
import Avatar from "~/components/Avatar/Avatar";
import MentionCustom from "~/components/Mentions/Mention";
import { useSelector } from "react-redux";
import postServices from "~/services/postServices";
import { RootState } from "~/redux/store";
const cx = classNames.bind(styles);
interface CreateCompProps {
    setModal: (modal: boolean) => void;
    modal: boolean;
    tippy: boolean | null;

    page: number;
    setPage: (page: number) => void;
}

const CreateComp: FC<CreateCompProps> = ({ setModal, modal, page, setPage, tippy }) => {

    const router = usePathname();
    const [play, setPlay] = useState<boolean>(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [step, setStep] = useState<STEP>(STEP.STEP_ONE);
    const [typeFile, setTypeFile] = useState<boolean>(false);
    const [publicPost, setPublicPost] = useState<boolean>(false);

    const [imgPreview, setimgPreview] = useState<string>("");
    const [file, setFile] = useState<any>("");
    const [imageAfterCrop, setImgAfterCrop] = useState("");
    const imgRef = useRef<any>();
    const [cropArea, setCropArea] = useState<any>(null);
    const [aspectRadio, setAspectRadio] = useState<any>(1 / 1);
    const [content, setContent] = useState<any>("");
    const userData = useSelector<RootState, any>((state: any) => state.auth.data);

    const [loading, setLoading] = useState(false);

    const handleToggle = () => {
        if (page === 3) {
            setPage(0);
            setModal(false);
        } else {
            setPage(3);
            setModal(true);
        }
    };


    const handleNextStep = async () => {
        switch (step) {

            case STEP.STEP_TWO:
                await handleCropImage();
                setStep(STEP.STEP_THREE)
                break;

            case STEP.STEP_THREE:
                // setStep(STEP.STEP_THREE)
                console.log("CALL CREATE POST");

                break;
            case STEP.STEP_FOUR:
                // setStep(STEP.STEP_THREE)
                setStep(STEP.STEP_FIVE)
                break;
            default:
                setStep(STEP.STEP_ONE);

        }
    }
    const handleBackStep = () => {
        switch (step) {
            case STEP.STEP_ONE:
                handleToggle();

            case STEP.STEP_TWO:
                setStep(STEP.STEP_ONE);
                setimgPreview("");
                setFile("");

                break;
            case STEP.STEP_THREE:
                setStep(STEP.STEP_TWO);
                break;
            case STEP.STEP_FOUR:
                setStep(STEP.STEP_ONE);
                setimgPreview("");
                setFile("");
                break;
            case STEP.STEP_FIVE:
                setStep(STEP.STEP_FOUR);
            
                break;
            default:
                setStep(STEP.STEP_ONE);

        }
    }
    const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {

        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);

            if (e.target.files[0].type === 'video/mp4') {
                setimgPreview(URL.createObjectURL(e.target.files[0]));
                reader.onloadend = () => {
                    setFile(reader.result);
                };
                setStep(STEP.STEP_FOUR)
                setTypeFile(true);
            } else {
                setimgPreview(URL.createObjectURL(e.target.files[0]));
                setFile(e.target.files[0]);
                setStep(STEP.STEP_TWO)
            }


        }

    }

    const handleCropImage = async () => {
        try {

            const result = await getCroppedImg(imgPreview, cropArea);
            setImgAfterCrop(result.url);
            setFile(result.file);
            const reader = new FileReader();
            reader.readAsDataURL(result.file);
            console.log("Here");
            reader.onload = () => {
                setFile(reader.result);
            };

        } catch (error) {
            console.log(error);
        }
    }



    const [text, setText] = useState("");

    function handleOnEnter(text: any) {
        console.log("enter", text);
    }
    const handlePlayVideo = () => {
        if (videoRef.current !== null) {
            if (play === false) {
                videoRef.current.play();
            } else {
                videoRef.current.pause();
            }
            setPlay(!play);
        }
    };
    const handleSetPlay = () => {
        setPlay(false);
    };
    const handleCreatePost = async () => {

        let payload = {
            userId: userData.id,
            img: file,
            content: content,
            typeFile: typeFile,
            publish : publicPost
        }
        setLoading(true);
        const result = await postServices.handleCreatePost(payload)
        if (result) {
            toast.success("Posting success !", {
                autoClose: 3000
            })
            setPage(0);
            setModal(false);
            setLoading(false);

        }

    }
    const hanldePublicPost = () => {
        setPublicPost(!publicPost);
    }


    return (
        <>
            {tippy !== null ? (
                <TippyCustom content={<FormattedMessage id="Navbar.create" />} place={tippy === true ? "top" : "right"}>
                    <div className={cx("nav_item", modal && "active", page === 3 && "border")} onClick={handleToggle}>
                        <div className={cx("icon")}>
                            <CreateIcon
                                fill={page === 3 ? "var(--text-color)" : "none"}
                                strokeWidth={page === 3 ? "2.5" : "1.5"}
                            />
                        </div>
                        <span>
                            <FormattedMessage id="Navbar.create" />
                        </span>
                    </div>
                </TippyCustom>
            ) : (
                <div className={cx("nav_item", modal && "active", page === 3 && "border")} onClick={handleToggle}>
                    <div className={cx("icon")}>
                        <CreateIcon
                            fill={page === 3 ? "var(--text-color)" : "none"}
                            strokeWidth={page === 3 ? "2.5" : "1.5"}
                        />
                    </div>
                    <span>
                        <FormattedMessage id="Navbar.create" />
                    </span>
                </div>
            )}
            {page === 3 && (
                <div className={cx("modal_create")}>
                    <div className={cx("main")}>
                        <div className={cx("header")}>
                            <div className={cx("back")} onClick={handleBackStep}>
                                <p>
                                    <BackIcon />
                                </p>
                            </div>
                            <div className={cx("title")}>
                                {
                                    step == STEP.STEP_ONE ? <FormattedMessage id="Post.Upload_image" /> :
                                        step == STEP.STEP_TWO ? <FormattedMessage id="Post.Crop" />
                                            :
                                            step == STEP.STEP_THREE && <FormattedMessage id="Post.New_post" />

                                }

                            </div>
                            {
                                step === STEP.STEP_TWO &&
                                <div className={cx("next")} onClick={handleNextStep}>
                                    <FormattedMessage id="Post.Next" />
                                </div>
                            }

                            {
                                step === STEP.STEP_THREE &&
                                <div className={cx("next")} onClick={handleCreatePost}>
                                    <FormattedMessage id="Post.Share" />
                                </div>
                            }
                            {
                                step === STEP.STEP_FOUR &&
                                <div className={cx("next")} onClick={handleNextStep}>
                                    <FormattedMessage id="Post.Next" />
                                </div>
                            }
                            {
                                step === STEP.STEP_FIVE &&
                                <div className={cx("next")} onClick={handleCreatePost}>
                                    <FormattedMessage id="Post.Share" />
                                </div>
                            }
                        </div>
                        <div className={cx("body")}>
                            {
                                step == STEP.STEP_ONE && <div className={cx(`step_${STEP.STEP_ONE}`)}>
                                    <div className={cx("tilte_1")}>
                                        <CameraIcon width="100px" height="100px" />
                                        <p>
                                            <FormattedMessage id="Post.Drag_something" />

                                        </p>
                                    </div>
                                    <div className={cx("input")}>
                                        <span>

                                            <FormattedMessage id="Post.Select_from_com" />

                                        </span>
                                        <input title=" "


                                            onChange={(event) => handleSelectFile(event)} type="file" accept="video/mp4, image/*" />
                                    </div>
                                    {
                                        imgPreview && <img ref={imgRef} id={cx("preview")} src={imgPreview} />
                                    }
                                </div>

                            }
                            {
                                step === STEP.STEP_TWO &&
                                <div className={cx(`step_${STEP.STEP_TWO}`)}>
                                    <CropImage aspectRadio={aspectRadio} setAspectRadio={setAspectRadio} image={imgPreview} setCropArea={setCropArea} />
                                </div>
                            }
                            {
                                step === STEP.STEP_THREE &&
                                <div className={cx(`step_${STEP.STEP_THREE}`)}>
                                    <div className={cx("pic")}>
                                        <img className={cx("last_image")} src={imageAfterCrop} />
                                    </div>
                                    <div className={cx("content_post")}>
                                        <div className={cx("content_header")}>
                                            <Avatar size={28} />
                                            <div className={cx("name")}>
                                                <p>
                                                    {userData.userName}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={cx("content_input")}>
                                            <MentionCustom setContent={setContent} currentHeight="392px" />
                                        </div>
                                        <div className={cx("content_footer")}>
                                            <div className={cx("content_footer-action")} >
                                                {
                                                    publicPost ?
                                                        <div className={cx("button_action")} onClick={hanldePublicPost}>
                                                            <LockIcon height="18px" width="18px" /><FormattedMessage id="Post.Private" />
                                                        </div>
                                                        :

                                                        <div className={cx("button_action")} onClick={hanldePublicPost}>
                                                            <EarthIcon height="18px" width="18px" /><FormattedMessage id="Post.Public" />
                                                        </div>
                                                }
                                            </div>
                                            <div className={cx("content_footer-message")}>
                                                {
                                                    publicPost ?
                                                        <FormattedMessage id="Post.Public_message" />
                                                        :
                                                        <FormattedMessage id="Post.Private_message" />

                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                            {
                                step === STEP.STEP_FOUR &&
                                <div className={cx(`step_${STEP.STEP_FOUR}`)}
                                    onClick={handlePlayVideo}
                                >
                                    <video
                                        playsInline
                                        disablePictureInPicture
                                        disableRemotePlayback
                                        preload="metadata"
                                        onEnded={handleSetPlay}
                                        ref={videoRef}
                                        muted
                                        controls
                                        controlsList="nofullscreen nodownload noremoteplayback noplaybackrate"
                                    >
                                        <source src={imgPreview} />
                                    </video>
                                </div>
                            }
                            {
                                step === STEP.STEP_FIVE &&
                                <div className={cx(`step_${STEP.STEP_FIVE}`)}>
                                    <div className={cx("pic")} onClick={handlePlayVideo}>
                                        <video
                                            playsInline
                                            disablePictureInPicture
                                            disableRemotePlayback
                                            preload="metadata"
                                            onEnded={handleSetPlay}
                                            ref={videoRef}
                                            muted
                                            controls
                                            controlsList="nofullscreen nodownload noremoteplayback noplaybackrate"
                                        >
                                            <source src={imgPreview} />
                                        </video>
                                    </div>
                                    <div className={cx("content_post")}>
                                        <div className={cx("content_header")}>
                                            <Avatar size={28} />
                                            <div className={cx("name")}>
                                                <p>
                                                    {userData.userName}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={cx("content_input")}>
                                            <MentionCustom setContent={setContent} currentHeight="392px" />
                                        </div>
                                        <div className={cx("content_footer")}>
                                            <div className={cx("content_footer-action")} >
                                                {
                                                    publicPost ?
                                                        <div className={cx("button_action")} onClick={hanldePublicPost}>
                                                            <LockIcon height="18px" width="18px" /><FormattedMessage id="Post.Private" />
                                                        </div>
                                                        :

                                                        <div className={cx("button_action")} onClick={hanldePublicPost}>
                                                            <EarthIcon height="18px" width="18px" /><FormattedMessage id="Post.Public" />
                                                        </div>
                                                }
                                            </div>
                                            <div className={cx("content_footer-message")}>
                                                {
                                                    publicPost ?
                                                        <FormattedMessage id="Post.Public_message" />
                                                        :
                                                        <FormattedMessage id="Post.Private_message" />

                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                        {
                            loading &&
                            <div className={cx("modal_loading")}>
                                <InfinitySpin

                                    // width="83px"

                                    color="var(--primary-color)"

                                />
                            </div>
                        }
                    </div>

                </div>
            )}
        </>
    );
};

export default CreateComp;
