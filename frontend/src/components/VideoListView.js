import React, { useState, useRef } from 'react';
import { useData, DataProvider } from '../context/useData';
// import ModalImage from './Popup';
import axios from 'axios'

import Modal from 'react-modal'
import YouTube from 'react-youtube';
import ReactCrop, { Crop } from "react-image-crop"
import 'react-image-crop/dist/ReactCrop.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';



export default function VideoView(props) {
  const VideoList = props.VideoList

  const {
    Video_keyframe,
    setVideoKeyframe,
    startPoint,
    setStartPoint,
    endPoint,
    setEndPoint,
    keyframeKnn,
    setKeyframeKnn,
    dataKNN,
    setDataKNN,
    knn,
    setKnn

  } = useData()


  // const videoSrc = "https://www.youtube.com/embed/aFy4c5Oa-kU";

  const frameId = useRef(null);
  const refElement = useRef(null)
  const [openVideoModals, setOpenVideoModals] = useState({});
  const [videoSrcs, setVideoSrcs] = useState({});

  const [keyframe_with_location, setKeyframe_with_location] = useState('')


  const [imgurli, setImageurli] = useState('')
  // const [point, setPoint] = useState({ x: 0, y: 0 });
  // const [listpoint, setListPoint] = useState([])

  const [openImageModals, setOpenImageModals] = useState({});



  const [resquetData, setResquestData] = useState({})
  const [resulKNN, setResultKNN] = useState([{}])

  const [ptsVi, setPtsVi] = useState({})

  const [crop, setCrop] = useState();
  const [croppedImage, setCroppedImage] = useState();
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);

  const imageRef = React.useRef(null);

  const handleImageLoad = () => {
    setImageWidth(imageRef.current.width);
    setImageHeight(imageRef.current.height);

  };


  const handleCrop = async (keyframe) => {

    if (crop) {
      // console.log(crop, imageWidth, imageHeight)
      const x = parseInt(crop.x / imageWidth * 1280)
      const y = parseInt(crop.y / imageHeight * 720)
      const x_w = parseInt((crop.x + crop.width) / imageWidth * 1280)
      const y_h = parseInt((crop.y + crop.height) / imageHeight * 720)
      setKeyframe_with_location(`${keyframe}+${x}+${y}+${x_w}+${y_h}`)
      console.log(`${keyframe}+${x}+${y}+${x_w}+${y_h}`)
    }
  }
  const handleCropChange = (newCrop) => {
    setCrop(newCrop);
  };


  const handleVideoOpen = (src, keyframe) => {
    setOpenVideoModals({ ...openVideoModals, [keyframe]: true });
  };


  const handleVideoClose = (keyframe) => {
    setOpenVideoModals({ ...openVideoModals, [keyframe]: false });
  };


  const handleImageOpen = (src, keyframe) => {
    setOpenImageModals({ ...openImageModals, [keyframe]: true });
  };


  const handleImageClose = (keyframe) => {
    // setKnn(true)
    setDataKNN({
      path: keyframe,
      top_left: startPoint,
      bottom_right: endPoint
    })


    setOpenImageModals({ ...openImageModals, [keyframe]: false });

  };

  const handleKNNSearch = (keyframe) => {
    console.log(`${keyframe}+${startPoint.x}+${startPoint.y}+${endPoint.x}+${endPoint.y}`)
    setKeyframe_with_location(`${keyframe}+${startPoint.x}+${startPoint.y}+${endPoint.x}+${endPoint.y}`)
  }


  const drawing = useRef(false);

  if (!VideoList || VideoList.length === 0 || Object.keys(VideoList[0]).length === 0) {
    return <div></div>;
  }


  const handleCheckboxChange = (event) => {
    const video_name = event.target.getAttribute("video")
    const keyframe = event.target.getAttribute("frame")

    console.log('keyframe ', keyframe)

    if (event.target.checked) {
      setVideoKeyframe({ "video": video_name, "keyframe": keyframe })
    }

  }



  return (
    <div class="content-custom">
      <div class="wrapper">
        {VideoList.map(video =>
          <div class="">
            <input type="checkbox" id={"myCheckbox_" + video.keyframe}
              video={video.video} frame={video.keyframe_idx} onChange={handleCheckboxChange} />
            <label for={"myCheckbox_" + video.keyframe}>
              <img src={"http://192.168.20.164:8081" + video.path}
                alt={video.keyframe} />
              <div class="bottom-right">{video.video},{video.keyframe_idx}</div>
              <div class="top-right">


                <button class="detail-form-btn" onClick={() => handleImageOpen("http://192.168.20.164:8081" + video.path, video.keyframe)}>KNN</button>



                <Modal
                  isOpen={openImageModals[video.keyframe]}
                  onRequestClose={() => handleImageClose(video.keyframe)}
                  contentLabel="Modal Image"
                  ariaHideApp={false}
                  id={video.keyframe}

                >



                  <div>
                    <ReactCrop crop={crop} onChange={handleCropChange}>
                      <img src={"http://192.168.20.164:8081" + video.path} alt='Crop' ref={imageRef} onLoad={handleImageLoad} />
                    </ReactCrop>
                  </div>
                  <div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <button class="contact1-form-btn" onClick={() => { handleCrop(video.keyframe) }}>
                          <span>Crop</span>
                        </button>
                        <a class="contact1-form-btn" style={{ display: 'flex', alignItems: 'center' }} href={`/knn/${keyframe_with_location || `${video.keyframe}+0+0+1280+720`}`}>
                          <span style={{ margin: 'auto' }}>Search</span>
                        </a>
                      </div>
                      <p dangerouslySetInnerHTML={{ __html: `<span style="color: #fc7fb2">OCR:</span> ${video.OCR.replace(/\n/g, '<br />')}<br /><span style="color: #fc7fb2">ASR:</span> ${video.ASR.replace(/\n/g, '<br />')}` }}></p>

                    </div>
                  </div>
                </Modal>

              </div>


              {/* view video  */}

              <div class='bottom-left'>
                <button class="detail-form-btn" onClick={() => handleVideoOpen("http://192.168.20.164:8081" + video.path, video.keyframe)}>Video</button>
                <Modal
                  isOpen={openVideoModals[video.keyframe]}
                  onRequestClose={() => handleVideoClose(video.keyframe)}
                  contentLabel="Modal Image"
                  ariaHideApp={false}
                >
                  <div class='video-view'>
                    <YouTube videoId={video.youtube_id} opts={{ playerVars: { start: parseInt(video.pts_time) } }} class='video-youtube' />

                  </div>
                  <p dangerouslySetInnerHTML={{ __html: `<span style="color: #fc7fb2">ASR:</span> ${video.ASR}<br /><span style="color: #fc7fb2">OCR:</span> ${video.OCR.replace(/\n/g, '<br />')}` }}></p>

                </Modal>
              </div>


              <div class="top-left">
                <a class="detail-form-btn" href={"/detail/" + video.keyframe}>
                  <span>
                    Detail
                  </span>
                </a>
              </div>


            </label>
          </div>
        )}
      </div>
    </div>

  )

}