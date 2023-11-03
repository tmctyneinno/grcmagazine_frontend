import React,{useState, useEffect} from 'react'
import '../css/chuk.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AES, enc } from 'crypto-js';
import { useNavigate } from 'react-router-dom';
let local = localStorage.getItem('userlogindetails')?JSON.parse(AES.decrypt(localStorage.getItem('userlogindetails'), 'GRCMAZAGINE').toString(enc.Utf8)):{}
export default function UserSignup() {
    const [email, Setemail] = useState(Object.keys(local).length > 0?local.email:'');
    const [password, Setpassword] = useState('');
    const [message, Setmessage] = useState('');
     const [name, Setname] = useState(Object.keys(local).length > 0?local.name:'');
     const [userdata, Setuserdata] = useState(local?local:{})
     const [password_confirmation, Setpassword_confirmation] = useState('');
     const [term, Setterm] = useState(false);
    const apiClient = axios.create({
        baseURL: "http://api.tmcinstitute.com",
        withCredentials: true
      });

      const navigate = useNavigate();

      useEffect(()=>{
        if(Object.keys(local).length === 0){
          console.log('nothing')
        }else{
            if(local.usertype === "Admin" || local.usertype === "User" ){
              console.log(userdata)
              Setemail(userdata.email)
              Setname(userdata.name)
           }else{
            localStorage.clear();
            // window.location.href='/'
            navigate('/')
           }
        } 
        },[])

    const handleClick = ()=>{
      if(term === true){
        
        let formData = new FormData();
        let headers = new Headers();
        headers.append('Content-Type', 'application/json')
        formData.append('name', name)
        formData.append('email',  email)
        formData.append('password',  password)
        formData.append('password_confirmation', password_confirmation)
        formData.append('term', term)
        let urltwo = '/api/usersignup';
        apiClient.get('/sanctum/csrf-cookie').then(()=>{
          apiClient.post(urltwo, formData, headers).then(res=>{
            console.log(res)
                if(res.data.success){
                 Setmessage(res.data.success)
                //  setTimeout(()=>{
                //   window.location.href = `http://localhost:3000/user/login`;
                //  },2500)

                }
       
               }).catch(err=>{
                 let error = err.response.data.errors
                 if(error.email){
                  Setmessage(error.email[0])                          
                 }else if(error.password){
                   Setmessage(error.password[0])
                 }else if(error.name){
                   Setmessage(error.name[0])
     
                 }
             })


        })

      }else{
        Setmessage('please accept the terms and conditions')
      }
    }
  
    const handleCheck =(e)=>{


      if(e.target.checked === false){
        Setterm(e.target.checked)
      }else{
        Setterm(e.target.checked)  
      }
    }
  
    // usersignup
  return (
    <div>
    <div id="preload-block">
    <div className="square-block"></div>
  </div>

  

    <div className="h-full w-full flex flex-row items-center">
      <div className="w-full h-full sm:w-full sm:h-full md:w-1/3 md:h-full lg:w-1/3 lg:h-full flex flex-col items-center ">

        <section className='w-1/3 '>
        <img src="https://res.cloudinary.com/the-morgans-consortium/image/upload/v1679299410/Grc%20magazine/GRC_Fincrime_mrzg31.png" className='w-full h-full' alt="brand-logo"/>
        </section>


        <article className='w-full flex flex-col items-center mt-3 bg-[#f0f2f5] py-2 px-2'>
           
        <div className='w-full flex flex-col items-center'>
        <h3 className="auth-title">Register your account</h3>
        <p>Don have an account? 
                <Link to="/user/login">
                <a className="lnk-toggler">Sign in </a>
                </Link>
                </p>

         </div>

         <span className={message === 'please check your email'?'w-full text-center text-green-400 items-center font-semibold text-lg':'w-full text-center text-red-400 items-center font-semibold text-lg'} >{message?message:" "}</span>

        <div className='w-full'>
          <input type="text" className='w-full rounded-sm border' value={name} onChange={(e)=>Setname(e.target.value)} placeholder="Name" />
        </div>

        <div className='w-full mt-2'>
          <input type="email" className='w-full rounded-sm border' value={email} onChange={(e)=>Setemail(e.target.value)} placeholder="Email address" />
        </div>

        <div className='w-full mt-2'>
          <input type="password" className='w-full rounded-sm border' value={password} onChange={(e)=>Setpassword(e.target.value)}  name="password" placeholder="Password" />
        </div>

        <div className='w-full mt-2'>
          <input type="password" className='w-full rounded-sm border' value={password_confirmation} onChange={(e)=>Setpassword_confirmation(e.target.value)} name="password" placeholder="confirm Password"/>
        </div>

        <div className='w-full'>
          <article className='w-1/3 float-right flex flex-row items-center'>
         <span className='w-10/12 text-center'> terms and conditions</span>
         <span className='w-1/12 grid place-content-center'><input type="checkbox" onChange={(e)=>handleCheck(e)} className='p-3'/></span>
          </article>
        </div>

          <div className='w-full flex flex-row items-center'>
          <button className="btn btn-lg btn-primary btn-block xoxx" type="submit" onClick={handleClick}>Login</button>
          </div>
          </article> 

       
      </div> 
      
      <div className="hidden sm:hidden md:w-3/4 md:h-screen lg:w-3/4 lg:h-screen bg-[#FF6600]  md:grid md:place-content-center lg:grid lg:place-content-center  " >
        <div className="">
          <div className="grid place-content-center">
            <h3 className='text-2xl text-white text-center'>Welcome to GRC and Financial Crime Today</h3>
            {/* <p className='text-base text-white'>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p> */}
          </div>
        </div>
        
      </div>
    </div> 
  

  </div>

  )
}
