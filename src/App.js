import './App.css';
import Home from './pages/Home';
import List from './pages/List';
import Single from './pages/Single';
import Contact from './pages/Contact';
import Adminlogin from './Admin/Adminlogin';
import Userlogin from './User/Userlogin';
import UserSignup from './User/UserSignup';
import { Route, Routes } from 'react-router-dom';
import Storieslist from './Admin/Storieslist';
import Profile from './User/Profile';
import CreateStories from './pages/CreateStories';
import Email from './pages/Email';
import Chat from './pages/Chat';
import ViewStories from './User/ViewStories';
import Sub from './pages/Sub';
import CreateSubscribe from './Admin/CreateSubscribe';
import ViewComment from './Admin/ViewComment';
import Advertisement from './pages/Advertisement';
import Commentreport from './Admin/Commentreport';
import AdminAdvest from './Admin/AdminAdvest';
import Advertpayment from './pages/Advertpayment';
function App() {
  // hgyfg
  return (
    <div>
     <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/lists" element={<List/>}/>
      <Route path="/single/:slug" element={<Single/>}/>
      <Route path="/contact" element={<Contact/>}/>
      <Route path="/admin/login" element={<Adminlogin/>}/>
       <Route path='/user/login' element={<Userlogin/>}/>
       <Route path='/user/register' element={<UserSignup/>} />
       <Route path='/admin/list' element={<Storieslist/>} />
       <Route path='/user/profile' element={<Profile/>} />
       <Route path="/createstories" element={<CreateStories/>} />
       <Route path='/email/:email/:code' element={<Email/>} />
       <Route path='/chat' element={<Chat/>} />
       <Route path='user/viewstories' element={<ViewStories/>} />
       <Route path="/subscribe" element={<Sub/>} />
       <Route path="/admin/createSubscribe" element={<CreateSubscribe/>} />
       <Route path='/admin/viewcomment' element={<ViewComment/>} />
       <Route path='/admin/report' element={<Commentreport/>}  />
       <Route path='/advert'  element={<Advertisement/>} />
       <Route path='/admin/Advert' element={<AdminAdvest/>} />
       <Route path='/advertpayment/:id'  element={<Advertpayment/>} />
     </Routes>
    </div>
  );
}

export default App;
