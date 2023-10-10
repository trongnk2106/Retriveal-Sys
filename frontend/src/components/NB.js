import React, { useState, useRef, useEffect } from 'react';
import VideoView from './VideoListView';
import axios from 'axios';
import { useData } from '../context/useData';
import Select from "react-select"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { ChromePicker } from 'react-color';

function NBar() {
  
  const [selectedOption, setSelectedOption] = useState(null);

  const [object, setObject] = useState({
    obj: [],
    listv: [],
  });

  // const [flag, setFlag] = useState(false);

  const [formData, setFormData] = useState({
    description: '', // Combine Vietnamese, English, ASR, and OCR into one description field
  });

  const [descriptionType, setDescriptionType] = useState('Vietnamese'); // Default to Vietnamese
  const [selectedColor, setSelectedColor] = useState('#AD5B7D')
  const [showColorPicker, setShowColorPicker] = useState(false);

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
    submit,
    setSubmit,
    flag,
    setFlag,
  } = useData();

  const handleInputChange = (event) => {
    setFormData({ ...formData, ['description']: event.target.value }); // Update the selected description type
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSelectedOption(null);

    console.log(formData);

    // Send both the description and selected type to the server
    await axios
      .post('http://192.168.20.164:8081/api/video/', {
        description: formData.description,
        type: descriptionType,
      })
      .then(async (res) => {
        setVideoList(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleTypeChange = (selectedType) => {
    setDescriptionType(selectedType.value); // Update the selected type when the user changes it
  };

  const handleColorChange = (color) => {
    setSelectedColor(color.hex); // Cập nhật giá trị màu đã chọn
  };

  const toggleColorPicker = () => {
    setShowColorPicker(!showColorPicker);
  };

  const handleSubmision = async (event) => {
    console.log(Video_keyframe.video, Video_keyframe.keyframe)
    // alert("Submit image keyframe")

    const item = Video_keyframe.video
    const frame = Video_keyframe.keyframe

    // Define the session ID
    const session = 'node0zav60ivp9yzv1nwb9rixf08yn332';

    // Create the parameter object
    const params = {
      item,
      frame,
      session,
    };

    const url = 'https://eventretrieval.one/api/v1/submit';
    var message = '';
    await axios.get(url, { params })
      .then(async (response) => {
        const respond_data = response.data
        if (response.status === 200) {
          message = `Submit video ${item}, frame ${frame} successful. The respond returns: \nSubmission: ${respond_data.submission} \nDescription: ${respond_data.description} \nStatus: ${respond_data.status}`
          // alert(message)
        } else {
          message = `Submit video ${item}, frame ${frame} error. The respond returns: \nSubmission: ${respond_data.submission} \nDescription: ${respond_data.description} \nStatus: ${respond_data.status}`
          // alert(message)
        }
      })
      .catch((error) => {
        const respond_data = error.response.data
        message = `Submit video ${item}, frame ${frame} error. The respond returns: \nSubmission: ${respond_data.submission} \nDescription: ${respond_data.description} \nStatus: ${respond_data.status}`
      });
      alert(message)
      axios
      .post('http://192.168.20.164:8081/api/log', { message })
      .then((response) => {
        console.log('Log message sent to the backend:', response.data);
      })
      .catch((error) => {
        console.error('Error sending log message to the backend:', error);
      });
  }

 

  const handleObject = (option) => {
    // console.log(option.value)
    const selectedValues = option.map((op) => op.value)
    console.log(selectedValues)
    setSelectedOption(option.value);
    setObject({ obj: selectedValues, listv: VideoList })
    // console.log(object)
  };

  const handObjectSearch = async (event) => {
    setFlag(true)

    await axios
      .post('http://192.168.20.164:8081/api/object/', object)
      .then(async (res) => {
        console.log('object :', res.data)
        setVideoListObject(res.data)
      })
      .catch((error) => {

        console.error(error);
      });
  }

  const handleColorSearch = async (event) => {
    setFlag(true)
    await axios
      .post('http://192.168.20.164:8081/api/video/color/', { 'color': selectedColor, 'listfilter': VideoList })
      .then(async (res) => {
        // console.log('object :', res.data)
        setVideoListObject(res.data)
      })
      .catch((error) => {

        console.error(error);
      });
  }

  const textAreaRef = useRef(null); // Ref for the textarea element

  useEffect(() => {
    // Update the height of the textarea based on its content
    if (textAreaRef.current) {
      const scrollHeight = textAreaRef.current.scrollHeight;
      textAreaRef.current.style.height = scrollHeight + 'px'; // Set the height to fit the content
    }
  }, [formData.description]);


  const customStyles = {
    control: (provided, state) => ({
      ...provided,

      width: '120px', // Keep the width of the control (dropdown) as before
      fontSize: '75%',
      border: 'none',
      boxShadow: 'none',
    }),
    container: (provided, state) => ({
      ...provided,
      width: '120px', // Set the width of the container (dropdown wrapper) to match the control's width
    }),
    menu: (provided, state) => ({
      ...provided,
      top: '60%'
    }),
    indicatorSeparator: (provided, state) => ({
      ...provided,
      display: 'none',
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: '75%',
      backgroundColor: state.isSelected ? 'rgba(252, 127, 178, 0.9)' : 'transparent',
      color: 'black', // Set text color to black
      '&:hover': {
        backgroundColor: 'rgba(252, 127, 178, 0.6)', // Use rgba for alpha (80%)
      },
      lineHeight: '1.25', // Adjust line height as needed (default is usually 1.5)
    }),
  };

  const objectStyles = {
    control: (provided, state) => ({
      ...provided,
      fontSize: '90%',
      border: state.isFocused ? '2px solid #fc7fb2' : '1px solid #ced4da', // Blue border when focused, gray border when not focused
      '&:hover': {
        border: '2px solid #fc7fb2'
      },
      boxShadow: 'none',
    }),
    indicatorSeparator: (provided, state) => ({
      ...provided,
      display: 'none',
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: '80%',
      backgroundColor: state.isSelected ? '#fc7fb2' : 'transparent',
      color: 'black', // Set text color to black
      '&:hover': {
        backgroundColor: 'rgba(252, 127, 178, 0.6)', // Use rgba for alpha (80%) on hover
      },
    }),
  };

  return (
    <div>
      <nav id="sidebar">
        <form onSubmit={handleSubmit} class="subscribe-form p-4">
          {/* Select the description type */}
          <Select
            value={{ value: descriptionType, label: descriptionType }}
            onChange={handleTypeChange}
            options={[
              { value: 'Vietnamese', label: 'Vietnamese' },
              { value: 'English', label: 'English' },
              { value: 'OCR', label: 'OCR' },
              { value: 'ASR', label: 'ASR' },
            ]}
            styles={customStyles} // Apply custom styles
          />

          {/* Input for the selected description type */}
          <div class="form-group d-flex" data-validate="Text description is required">
            <textarea
              ref={textAreaRef} // Assign the ref to the textarea
              class="icon form-control"
              name={descriptionType}
              placeholder={`${descriptionType} description`}
              value={formData[descriptionType]}
              onChange={handleInputChange}
            ></textarea>
            <span class="icon-paper-plane"></span>
          </div>

          <div class="container-contact1-form-btn">
            <button class="contact1-form-btn">
              <span>Search</span>
            </button>
          </div>
        </form>
        <div class="border-top p"></div>
        <div class="p-4">
          <div style={{ display: 'flex', flexDirection: 'row' }}>

            {/* <div style={{ width: '90%' }}>
              <ChromePicker color={selectedColor} onChange={handleColorChange} />
          </div> */}
            <div className="color-picker" style={{width: '90%' }}>
              <div onClick={toggleColorPicker} style={{ cursor: 'pointer', width: '100%' }}>
                <div
                  style={{
                    width: '100%',
                    height: '24px',
                    borderRadius: '4px',
                    background: selectedColor,
                  }}
                />
              </div>
              {showColorPicker && (
                <div className="color-picker-dropdown">
                  <ChromePicker
                    color={selectedColor}
                    onChange={handleColorChange}
                  />
                </div>
              )}
            </div>
            <div class="object-container" style={{"top": "0%"}}>
              <button
                class="object-button"
                onClick={handleColorSearch}
              >
                <span>
                  <FontAwesomeIcon icon={faSearch} />
                </span>
              </button>
            </div>
          </div>

          <div style={{ paddingTop: '1.5rem', display: 'flex', flexDirection: "row", flex: 1 }}>
            <div style={{ width: '90%' }} id="Objectsearch">
              <Select
                value={selectedOption}
                isMulti
                onChange={handleObject}
                options={options}
                styles={objectStyles}
              />
            </div>


            <div class="object-container">
              <button
                class="object-button"
                onClick={handObjectSearch}
              >
                <span>
                  <FontAwesomeIcon icon={faSearch} />
                </span>
              </button>
            </div>
          </div>
        </div>


        <div class="border-top p"></div>



        <div class="container-contact1-form-btn p-4">
          <button class="contact1-form-btn"

            onClick={handleSubmision}
          >
            <span>
              Submit
            </span>
          </button>
        </div>

      </nav>

    </div>

  );
}

export default NBar;