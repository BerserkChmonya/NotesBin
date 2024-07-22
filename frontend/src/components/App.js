import logo from '../logo.png';
import note_logo from '../note_logo.png';
import './App.css';

import Header from './content/Header.js';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginForm from './authorization/LoginForm.js';
import ProfilePage from './content/ProfilePage.js';
import ContentPage from './content/ContentPage.js';
import NotePage from './content/NotePage.js';
import FriendPage from './content/FriendPage.js';
import { FriendsProvider } from './context/FriendsContext';
import VerificationPage from './authorization/VerificationPage.js';
import ResetPasswordPage from './authorization/ResetPasswordPage.js';

function App() {
  return (
    <FriendsProvider>
      <BrowserRouter>
        <div className="App">
          <Header logoSrc={logo} noteLogo={note_logo} pageTitle="NotesBin" />
          <div className="content" style={{margin: "20px"}}>
            <Routes>
              <Route exact path="/" element={<LoginForm />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/page" element={<ContentPage />} />
              <Route path="/note" element={<NotePage />} />
              <Route path="/friend" element={<FriendPage />}/>
              <Route path="/verify" element={<VerificationPage />} />
              <Route path="/reset" element={<ResetPasswordPage />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </FriendsProvider>
  );
}

export default App;
