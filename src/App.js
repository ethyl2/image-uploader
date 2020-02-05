import React from 'react';
import logo from './logo.svg';
import './App.scss';
import woman1 from './images/woman1.jpg';
import axios from 'axios';

function App() {
  const handleChange = event => {
    const imgPreview = document.getElementById('imgPreview');
    console.log(event.target.files[0]);
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET)

    axios({
      url: process.env.REACT_APP_CLOUDINARY_URL,
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: formData
  })
      .then(res => {
          console.log(res);
          imgPreview.src = res.data.secure_url;

      })
      .catch(err => {
          console.log(err);
      })
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Incredible Image Uploader</h1>
      </header>
      <div className='main-content'>
        <form>
          <legend>Pick your image to upload:</legend>
          <label htmlFor='imgSelection'>Select your file:</label>
          <input type='file'
            name='imgSelection'
            id='imgSelection'
            onChange={handleChange}
          />
        </form>
        <div className='img-container'>
          <img src={woman1} alt='uploaded placeholder' id='imgPreview' />
        </div>
      </div>
    </div>
  );
}

export default App;
