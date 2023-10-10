import React, {useState} from 'react';
import VideoView from './VideoListView';
import axios from 'axios';
import { useData } from '../context/useData';
import NBar from './NB';


function Home() {


  const [selectedOption, setSelectedOption] = useState(null)
  
  const [object, setObject] = useState({
    obj: "",
    listv: []
  })

  // const [flag, setFlag] = useState(false)


  const [formData, setFormData] = useState({
    Vietnamese: '',
    English: '',
  });

  const [videoKnn, setVideoKnn] = useState([{}])

  // const [datasub, setDatasub] = useState([])
  
  const {
    Video_keyframe, 
    setVideoKeyframe,
    options,
    VideoList,
    setVideoList,
    VideoListObject,
    setVideoListObject,
    setDatasub,
    datasub,
    dataKNN,
    setDataKNN,
    knn,
    setKnn,
    flag,
    setFlag
    
  } = useData()


  // const handleInputChange = (event) => {
  //   setFormData({ ...formData, [event.target.name]: event.target.value });
  // };


  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   setSelectedOption(null)
    
  //   console.log(formData)
  //   await axios
  //     .post('http://192.168.20.164:8081/api/video/', formData)
  //     .then(async (res) => {   
  //         // console.log(res.data)
  //         setVideoList(res.data)
  //     })
  //     .catch((error) => {
  //       // Handle errors
  //       console.error(error);
  //     });
  // };



  // const handleKNNSearch = async(event) => {
  //   event.preventDefault();
  //   setKnn(true)
  //   await axios
  //     .post('http://192.168.20.164:8081/api/video/knn/', dataKNN)
  //     .then(async (res) => {   
  //         console.log(res.data)
  //         setVideoKnn(res.data)
  //     })
  //     .catch((error) => {
  //       // Handle errors
  //       console.error(error);
  //     });
  // }

  // const handleExport = async (event) =>{
  //   let result = []
  //   for(let [key, value] of Object.entries(Video_keyframe)){
  //     if (key !== "0" ){
  //       let item = {video_name : key, keyframe : value}
  //       console.log("check submit",item)
  //       result.append(item)
  //     }
      
  //   }
  //   console.log("checkresult" ,result)
  //   setDatasub(result)
  // }

  // const handleObject = (option) => {
    // setSelectedOption(option.value);
    // setObject({obj:option.value, listv:VideoList})
    // console.log(object)
  // };  

  // const handObjectSearch = async(event) =>{
  //   setFlag(true)

  //   await axios
  //   .post('http://192.168.20.164:8081/api/object/', object)
  //   .then(async (res) => {   
  //       console.log('object :',res.data)
  //       setVideoListObject(res.data)
  //   })
  //   .catch((error) => {
    
  //     console.error(error);
  //   });
  // }


  let content;
  if (flag === false && (knn === true || knn === false )){
    content = <VideoView VideoList={VideoList} />
  } 
  if (flag === false && knn === true){
    // content = <VideoView VideoList={videoKnn} />
    // content = <span>O day hien video KNN</span>
  }
  if (flag === true && knn === false){
    content = <VideoView VideoList={VideoListObject} />
  }
  

  return (
    <div class="d-md-flex align-items-stretch">
     
      <NBar/>
      <div id="content">
      {content}  
      </div>
    </div>
      // <div class="d-md-flex align-items-stretch">
      // <nav id="sidebar">
      //   <form onSubmit={handleSubmit}
      //     class="subscribe-form p-4">
      //     <div class="form-group d-flex" data-validate="Text description is
      //       required">
      //       <textarea class="icon form-control" name="Vietnamese" 
      //       placeholder="Vietnamese description" value={formData.Vietnamese} 
      //       onChange={handleInputChange}></textarea>

      //       <span class="icon-paper-plane"></span>
      //     </div>
      //     <div class="form-group d-flex" data-validate="Text description is
      //       required">
      //       <textarea class="icon form-control" name="English" 
      //       placeholder="English description" value={formData.English} 
      //       onChange={handleInputChange}></textarea>

      //       <span class="icon-paper-plane"></span>
      //     </div>
      //     <div class="container-contact1-form-btn">
      //       <button class="contact1-form-btn">
      //         <span>
      //           Search
      //         </span>
      //       </button>
      //     </div>
      //   </form>
      //   <div class="border-top p"></div>
      //   <p id="result" class="passage"></p>
        
      //   <div style = {{display:'flex',flexDirection:"row", flex:1}}>
      //     <div style={{color:"black", width:'80%'}}>
      //       <Select 
      //       value={selectedOption}
      //       onChange={handleObject}
      //       options={options}
      //       />
      //     </div>
      //     <div style={{marginTop:"5px", borderRadius:"5px"}}>
      //       <button onClick={handObjectSearch}>
      //         <span>
      //           Object
      //         </span>
      //       </button>
      //     </div>
      //   </div>

      //   {/* <div class="container-contact1-form-btn p-4">
      //   <button onClick={handleKNNSearch} class="contact1-form-btn">
      //     <span>
      //       KNN Search
      //     </span>
      //   </button>
      // </div> */}
        

      //   {/* <div class="container-contact1-form-btn p-4">
      //     <button onClick={handleExport} class="contact1-form-btn">
      //       <span>
      //         <CSVLink data= {datasub} filename="submit.csv" headers={[{ label: "Video Name", key: "video_name" }, { label: "Keyframe", key: "keyframe" }]}> Export Submission </CSVLink> 
      //       </span>
        
      //     </button>
      //   </div> */}
        
      // </nav>
      // {/* {flag === false ? (
      //   <div id="content" class="content-custom">
      //     <VideoView VideoList={VideoList} />
      //   </div>
      // ) : (
      //   <div id="content" class="content-custom">
      //   <VideoView VideoList={VideoListObject} />
      // </div>
      // )} */}
    
      
  );
}

export default Home;