import React, { useState } from 'react';

import './App.scss';
import woman1 from './images/woman1.jpg';
import axios from 'axios';

function App() {

  const initialUser = {
    username: '', 
    name: '', 
    email: '', 
    phone_number: '', 
    job_description: '', 
    password: '',
    profile_img_src: woman1
  }

  const [user, setUser] = useState(initialUser);
  const [registeredUser, setRegisteredUser] = useState(null);
  const [message, setMessage] = useState('');
  const [qrCodeUrl, setqrCodeUrl] = useState(null);

  const handleUploaderChange = event => {
    
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
          setUser({...user, profile_img_src: res.data.secure_url});
      })
      .catch(err => {
          console.log(err);
      })
  }

  const handleInputChange = event => {
    setUser({...user, [event.target.name]: event.target.value})
  }

  const handleSubmit = event => {
    event.preventDefault();
    console.log(user);
    axios.post('https://business-card-collector.herokuapp.com/api/users/register', user)
      .then(res => {
        console.log(res);
        setRegisteredUser(res.data.user);
        localStorage.setItem('token', res.data.token);
        setUser({...initialUser, profile_img_src: res.data.user.profile_img_src});
        setMessage(`Welcome, ${res.data.user.name}!`)
        setqrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${res.data.user.profile_img_src}`);
      })
      .catch(err => {
        console.log(err);
        setMessage('Sorry, there was an error while uploading your profile. Try again later.')
      })
  }

  return (
    <div className="App">

      <header className="App-header">
        <h1>Incredible Image Uploader</h1>
      </header>

      <div className='main-content'>

        <form onSubmit={handleSubmit}>
          <legend>Create an Account: </legend>
          <div>
            <label htmlFor='username'>Username**: </label>
            <input type='text'
              id='username'
              name='username'
              onChange={handleInputChange}
              value={user.username}
              placeholder='username'
              required
              />
          </div>

          <div>
            <label htmlFor='password'>Password**: </label>
            <input type='password'
              id='password'
              name='password'
              onChange={handleInputChange}
              value={user.password}
              placeholder='********'
              required
            />
          </div>

          <div>
            <label htmlFor='name'>Name**: </label>
            <input type='text'
              id='name'
              name='name'
              onChange={handleInputChange}
              value={user.name}
              placeholder='name'
              required
              />
          </div>


          <div>
            <label htmlFor='email'>Email:</label>
            <input type='email'
              name='email'
              id='email'
              value={user.email}
              onChange={handleInputChange}
              placeholder='email'
            />
          </div>

          <div>
            <label htmlFor='job_description'>Position:</label>
            <input type='text'
              name='job_description'
              id='job_description'
              value={user.job_description}
              placeholder='job_description'
              onChange={handleInputChange}
              />
          </div>

          <div>
            <label htmlFor='phone_number'>Phone: </label>
            <input type='text'
              id='phone_number'
              name='phone_number'
              onChange={handleInputChange}
              value={user.phone_number}
              placeholder='phone'
              />
          </div>

          <div>
            <label htmlFor='imgSelection'>Select your profile image file to upload:</label>
            <input type='file'
              name='imgSelection'
              id='imgSelection'
              onChange={handleUploaderChange}
            />
          </div>

          <div>
            <label htmlFor='profile_img_src'>OR enter a url location of your profile image:</label>
            <input type='text'
              id='profile_img_src'
              name='profile_img_src'
              onChange={handleInputChange}
              value={user.profile_img_src}
              placeholder='url'
              />
          </div>

          <button type='submit'>Submit</button>

        </form>

        <div>
          {message && <h3>{message}</h3>}
        </div>

        <div className='img-container'>
          <img src={user.profile_img_src} alt='uploaded placeholder' id='imgPreview' />
        </div>

        {registeredUser && 
          <div>
            <h2>{registeredUser.name}</h2>
            {registeredUser.job_description && <h3>{registeredUser.job_description}</h3>}
            <p>{registeredUser.username}</p>

            {registeredUser.email && <p>{registeredUser.email}</p>}
            {registeredUser.phone_number && <p>{registeredUser.phone_number}</p>}
          </div>
        }

        {qrCodeUrl && <img src={qrCodeUrl} alt='qrCode that links with image' />}

      </div>

      <footer>
        <p>Copyright 2020 Heather Nuffer</p>
      </footer>
    </div>
  );
}

export default App;
