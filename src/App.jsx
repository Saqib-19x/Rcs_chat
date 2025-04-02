import { Fragment } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Auth/Login';
import Chatdetails from './User/Chatsinfo';
import PageNotFound from './Routes/Page404';
import Chatsmessage from './User/Chatsmessage';
import ChatDashboard from './User/Chatdashboard';
import ProtectedRoute from './Routes/Protectedroute';
import ChatInfo from './User/Chatsinfo';
import Enrollagents from './User/Enrollagents';
import Settings from './User/settings';
import RCSChats from './User/RCSChats';
import Test from './User/test';
import Test2 from './User/test2';


function App() {

  return (
    <Fragment>
      <BrowserRouter>
      
        <Routes>
          {/* common routes ................................. */}
          <Route path="/" element={<Login />} />
          {/* chats panel  .................................... */}
          <Route path='/chatdashboard' element={<ProtectedRoute Component={ChatDashboard} />} />
          <Route path="/chatinfo" exact element={<ChatInfo />} >
            <Route path=":id" exact element={<Chatsmessage />} />
          </Route>
          <Route path='/enroll-agent' element={<Enrollagents />} />
          <Route path="*" exact element={<PageNotFound />} />
          <Route path="/settings" exact element={<Settings/>} />
          <Route path="/rcschats" exact element={<RCSChats/>} />
          <Route path="/test" exact element={<Test/>} />
          <Route path="/test2" exact element={<Test2/>} />

        </Routes>

      </BrowserRouter>
    </Fragment>
  )
}

export default App
