import './App.css';
import { useState } from 'react';
const uuid = require('uuid');

function App() {
  const [image, setImage] = useState('');
  const [uploadResultMessage, setUploadResultMessage] = useState('Please upload the image to authenticate.');
  const [visitorName, setVisitorName] = useState('placeholder.jpg');
  const [isAuth, setAuth] = useState(false);
  function sendImage(e) {
    e.preventDefault();
    setVisitorName(image.name);
    const visitorImageName = uuid.v4();
    fetch(`https://7hylr7awgi.execute-api.us-east-1.amazonaws.com/dev/sm-visitor-images/${visitorImageName}.jpeg`, {
      method: 'PUT',
      headers: {
      'Content-Type': 'image/jpeg'
      },
      body: image
      }).then(async () => {
        const response = await authenticate(visitorImageName)
        if (response.Message === 'Success') {
          setAuth(true);
          setUploadResultMessage(`Hi ${response['firstName']} ${response['lastName']}, welcome to work. Hope you have a nice day!`)
        } else {
          setAuth(false);
          setUploadResultMessage('Authentication failed: this person is not an employee.')
        }
      }).catch(error => {
        setAuth(false);
        setUploadResultMessage('There is an error in the authentication process. Please try again.')
        console.error(error);
      })
  }
  async function authenticate(visitorImageName) {
    const requestURL = 'https://7hylr7awgi.execute-api.us-east-1.amazonaws.com/dev/employee?' + new URLSearchParams({
      objectKey: `${visitorImageName}.jpeg`
    });
    return await fetch(requestURL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
    .then((data) => {
      return data;
    }).catch(error => console.error(error));
  }

  return (
    <div className="App">
      <h2>My Company's Facial Recognition System</h2>
      <p>Take a photo and upload it to the visitors folder. Then, upload the image to the page and click on the Authenticate button.</p>
      <form onSubmit={sendImage}>
        <input type='file' name='image' onChange={e => setImage(e.target.files[0])}/>
        <button type='submit'>Authenticate</button>
      </form>
      <div className ={isAuth ? 'success' : 'failure' }>{uploadResultMessage}</div>
      <img src={require(`./visitors/${visitorName}`)} alt="Visitor" height={250} width={250}/>
    </div>
  );
}

export default App;
