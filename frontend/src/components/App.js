import logo from '../logo.png';
import note_logo from '../note_logo.png';
import './App.css';

import Header from './content/Header.js';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginForm from './authorization/LoginForm.js';
import ProfilePage from './content/ProfilePage.js';
import ContentPage from './content/ContentPage.js';
import NotePage from './content/NotePage.js';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header logoSrc={logo} noteLogo={note_logo} pageTitle="NotesBin" />
        <div className="content" style={{margin: "20px"}}>
          <Routes>
            <Route exact path="/" element={<LoginForm />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/page" element={<ContentPage />} />
            <Route path="/note" element={<NotePage/>} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
