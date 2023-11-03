import React,{useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import '../css/chuk.css';
import axios from 'axios';
import { AES, enc } from 'crypto-js';
import { useNavigate } from 'react-router-dom';
let local = localStorage.getItem('userlogindetails')?JSON.parse(AES.decrypt(localStorage.getItem('userlogindetails'), 'GRCMAZAGINE').toString(enc.Utf8)):{}
export default function Userlogin() {
 const [email,  Setemail] = useState('');
 const [password, Setpassword] = useState('');
 const [message, Setmessage] = useState('');
 const [userdata, Setuserdata] = useState(local?local:{})
 const navigate = useNavigate();
 const apiClient = axios.create({
  baseURL: "http://api.tmcinstitute.com",
  withCredentials: true
});

useEffect(()=>{
if(Object.keys(local).length === 0){
  console.log('nothing')
}else{
    if(local.usertype === "Admin" || local.usertype === "User" ){
      // window.location.href = `http://127.0.0.1:3000/user/profile`;
      navigate(`/user/profile`)
   }else{
    localStorage.clear();
    // window.location.href='/'
    navigate(`/`)

   }
} 
},[])

 const handleClick =(e)=>{
  e.preventDefault();
  let formData = new FormData();
  let headers = new Headers();
  headers.append('Content-Type', 'application/json')
  formData.append('email',  email)
  formData.append('password',  password)
  let urltwo = '/api/userlogin';
  apiClient.get('/sanctum/csrf-cookie').then(()=>{
    apiClient.post(urltwo, formData, headers).then(res=>{
      console.log(res)
          if(res.data.success){
            Setmessage(res.data.message)
            const encrypt= AES.encrypt(JSON.stringify(res.data.data), 'GRCMAZAGINE').toString();
            localStorage.setItem('userlogindetails', encrypt);
            setTimeout(()=>{
              navigate(`/user/profile`)

             },2500)

          }else if(res.data.error){
            Setmessage(res.data.error)
          }
 
         }).catch(err=>{
           let error = err.response.data.errors
           if(error.email){
            Setmessage(error.email[0])                          
           }else if(error.password){
             Setmessage(error.password[0])
           }
       })


  })
 }

  return (
    <div>
    <div id="preload-block">
    <div className="square-block"></div>
  </div>

  
  <div className="container-fluid">
    <div className="row">
      <div className="col-xs-12 col-sm-12 col-md-5 col-lg-4 authfy-panel-left">
        <div className="w-1/3 m-auto mt-5 py-4">
          <img src="https://res.cloudinary.com/the-morgans-consortium/image/upload/v1679299410/Grc%20magazine/GRC_Fincrime_mrzg31.png" width="150" alt="brand-logo"/>
        </div>
        <div className="authfy-login mt-4">
          <div className="authfy-panel panel-login text-center active">
            <div className="authfy-heading">
              <h3 className="auth-title">Login to your account</h3>
              <p>Don’t have an account? 
           <Link to="/user/register">
           <a className="lnk-toggler" >Sign up</a>
           </Link>
             
                
                </p>
            </div>
        
            <div className="row loginOr">
              <div className="col-xs-12 col-sm-12">
                <span className="spanOr">or</span>
                <span className={message === 'you logged in successfully'?'w-full text-center text-green-400 items-center font-semibold':'w-full text-center text-red-400 items-center font-semibold'} >{message?message:""}</span>

              </div>
            </div>
            <div className="row">
              <div className="col-xs-12 col-sm-12">
                <form name="loginForm" className="loginForm" method="post" >
           
                  <div className="form-group">
                    <input type="email" className="form-control email" value={email}  onChange={(e)=>Setemail(e.target.value)} name="username" placeholder="email address"/>
                  </div>
                  <div className="form-group">
                    <div className="pwdMask">
                    <input type="password" className="form-control password" value={password}  onChange={(e)=>Setpassword(e.target.value)} name="password" placeholder="Password"/>
                    <span className="fa fa-eye-slash pwd-toggle"></span>
                    </div>
                  </div>
                  <div className="row remember-row">
                    <div className="col-xs-6 col-sm-6">
               
                    </div>
                    <div className="col-xs-6 col-sm-6">
                      <p className="forgotPwd">
                        <a className="lnk-toggler" data-panel=".panel-forgot" href="#">Forgot password?</a>
                      </p>
                    </div>
                  </div> 
                  <div className="form-group">
                    <button className="btn btn-lg btn-primary btn-block xoxx" onClick={(e)=>handleClick(e)} type="submit">Login</button>
                  </div>
                </form>
              </div>
            </div>
          </div> 

      

          {/* <div className="authfy-panel panel-forgot">
            <div className="row">
              <div className="col-xs-12 col-sm-12">
                <div className="authfy-heading">
                  <h3 className="auth-title">Recover your password</h3>
                  <p>Fill in your e-mail address below and we will send you an email with further instructions.</p>
                </div>
           
              </div>
            </div>
          </div>  */}
        </div> 
      </div> 
      <div className="col-md-7 col-lg-8 authfy-panel-right hidden sm:hidden md:block lg:block ">
        <div className="hero-heading">
          <div className="headline">
          <h4 className='text-2xl text-white text-center'>Welcome to GRC and Financial Crime Today</h4>
            {/* <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p> */}
          </div>
        </div>
        
      </div>
    </div> 
  </div>

  </div>
  )
}
