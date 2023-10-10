import React, { useState, useEffect} from 'react';
import VideoView from './VideoListView';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useData } from '../context/useData';
import NBar from './NB';



function Detail() {
  const params = useParams()
  const keyframe = params.keyframe

  const [VideoList, setVideoList] = useState([{}])

  const [formData, setFormData] = useState({
    Vietnamese: '',
    English: '',
  });
  const [data, setData] = useState([])
  
  const {
    Video_keyframe, 
    setVideoKeyframe
  } = useData()

  useEffect( () => {
    axios.get('http://192.168.20.164:8081/api/video/detail/' + keyframe)
      .then((res) => {
        setVideoList(res.data)
      })
  },[keyframe]);

  // const handleInputChange = (event) => {
  //   setFormData({ ...formData, [event.target.name]: event.target.value });
  // };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   await axios
  //     .post('http://192.168.20.164:8081/api/video/', formData)
  //     .then(async (res) => {   
  //         setVideoList(res.data)
  //     })
  //     .catch((error) => {
  //       // Handle errors
  //       console.error(error);
  //     });
  // };
  // const handleExport = async(event) =>{
  //   let result = []
  //   for(let [key, value] of Object.entries(Video_keyframe)){
  //     if (key !== "0" ){
  //       let item = {video_name : key, keyframe : value}
  //       result.push(item)
  //     }
      
  //   }
  //   setData(result)
  // }
  return (
    

    <div class="d-md-flex align-items-stretch">
      <NBar/>
      <div id="content" class="content-custom"><VideoView VideoList={VideoList} /> </div>

      {/* <nav id="sidebar">
        <form onSubmit={handleSubmit}
          class="subscribe-form p-4">
          <div class="form-group d-flex" data-validate="Text description is
            required">
            <textarea class="icon form-control" name="Vietnamese"
              placeholder="Vietnamese desciption" value={formData.Vietnamese}
              onChange={handleInputChange}></textarea>
            <span class="icon-paper-plane"></span>
          </div>
          <div class="form-group d-flex" data-validate="Text description is
            required">
            <textarea class="icon form-control" name="English"
              placeholder="English desciption" value={formData.English}
              onChange={handleInputChange}></textarea>
            <span class="icon-paper-plane"></span>
          </div>
          <div class="container-contact1-form-btn">
            <button class="contact1-form-btn">
              <span>
                Search
              </span>
            </button>
          </div>
        </form>
        <div class="border-top p"></div>
        <p id="result" class="passage"></p>
        <div class="container-contact1-form-btn p-4">
          <button onClick={handleExport} class="contact1-form-btn">
            <span>
            <CSVLink data= {data} filename="submit.csv" headers={[{ label: "Video Name", key: "video_name" }, { label: "Keyframe", key: "keyframe" }]}> Export Submission </CSVLink> 
            </span>
          </button>
         
        </div>
      </nav> */}
    
  </div>
      
  );
}

export default Detail;