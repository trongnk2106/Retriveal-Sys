import React, { useState, useEffect} from 'react';
import VideoView from './VideoListView';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useData } from '../context/useData';
import NBar from './NB';



function KNN() {
  const params = useParams()
  const keyframe_with_location = params.keyframe_with_location
  
  console.log('in KNN search',keyframe_with_location)

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
    axios.get('http://192.168.20.164:8081/api/video/knn/' + keyframe_with_location)
      .then((res) => {
        setVideoList(res.data)
      })
  },[keyframe_with_location]);


  return (
    <div class="d-md-flex align-items-stretch">
      
      <NBar/>
      <div id="content" class="content-custom"><VideoView VideoList={VideoList} /> </div>


  </div>
      
  );
}

export default KNN;