import React, { FC, useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import classNames from "classnames/bind";
import styles from "./Cropper.module.scss";
import { AdjustIcon } from '~/assets/icon';
import { useImageSize, getImageSize } from 'react-image-size';
const cx = classNames.bind(styles);

interface CropImageProps {
    image: string;
    setCropArea: any;
    aspectRadio: any;
    setAspectRadio: any;
}

const CropImage: FC<CropImageProps> = ({ image, setCropArea, aspectRadio, setAspectRadio }) => {


    const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState<number>(1);
    const [modalAspect, setModalAspect] = useState(false);
    const [activeAspect, setActiveAspect] = useState(2);
    const [origin, setOrigin] = useState<number | undefined>(undefined);


    const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
        setCropArea(croppedAreaPixels);
    };
    const handleOpenAspect = () => {
        setModalAspect(!modalAspect);
    }

    const handleChangeAspect = async (value: any) => {
        setActiveAspect(value)
        if (value === 1) {
            const { width, height } = await getImageSize(image);
            console.log(width, height);
            setOrigin(width / height);
            
            setAspectRadio(undefined);
       
        }
        if (value === 2) {
            setOrigin(undefined);

            setAspectRadio(1 / 1)
        }
        if (value === 3) {
            setOrigin(undefined);

            setAspectRadio(4 / 3)
        }
        if (value === 4) {
            setOrigin(undefined);

            setAspectRadio(16 / 9)
        }
    }





    return (
        <div className={cx("cropper")}>

            <Cropper
                image={image}
                crop={crop}
                objectFit={aspectRadio === 1 ? 'cover' : aspectRadio === 4 / 3 ? 'contain' : (aspectRadio === undefined ? 'contain' : aspectRadio === 16 / 9 ? 'contain' : 'cover')}
                aspect={aspectRadio === undefined ? origin : aspectRadio}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}

                style={{
                    containerStyle: {
                        width: "100%",
                        height: "100%",
                        backgroundColor: "transparent",
                        cursor: 'grab',
                        pointerEvents: `${origin === undefined ? 'auto' : 'none'}`

                    },
                    mediaStyle: {
                        objectFit: 'cover',
                        maxHeight: '400px',
                        width: `${aspectRadio === undefined ? '400px' : 'auto'}`,
                        height: `${aspectRadio === undefined && 'auto'}`,

                    },
                    cropAreaStyle: {
                        borderBottomLeftRadius: `${aspectRadio === 1 ? '12px' : '0'}`,
                        borderBottomRightRadius: `${aspectRadio === 1 ? '12px' : '0'}`,
                    }
                }}
                showGrid={aspectRadio === undefined ? false : true}
                restrictPosition={true}
            // transform={aspectRadio === undefined ? 'translate(0,0)':'auto'}

            />

            <div className={cx("action")}>
                <div className={cx("button")} onClick={handleOpenAspect}>
                    <AdjustIcon width='18px' height='18px' />
                </div>
                {
                    modalAspect &&
                    <div className={cx("modal_aspect")}>
                        <div className={cx("aspect", activeAspect === 1 && "active")} onClick={() => handleChangeAspect(1)}>
                            <span>
                                Original
                            </span>
                        </div>
                        <div className={cx("aspect", activeAspect === 2 && "active")} onClick={() => handleChangeAspect(2)}>
                            <span>
                                1:1
                            </span>
                        </div>
                        <div className={cx("aspect", activeAspect === 3 && "active")} onClick={() => handleChangeAspect(3)}>
                            <span>
                                4:3
                            </span>
                        </div>
                        <div className={cx("aspect", activeAspect === 4 && "active")} onClick={() => handleChangeAspect(4)}>
                            <span>
                                16:9
                            </span>
                        </div>

                    </div>
                }
            </div>
        </div>

    );
};

export default CropImage;