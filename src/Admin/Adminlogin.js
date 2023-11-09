import React, {useState, useEffect} from 'react'
import '../css/adminlogin.css';
import axios from 'axios';
import { AES, enc } from 'crypto-js';
let local = localStorage.getItem('userlogindetails')?JSON.parse(AES.decrypt(localStorage.getItem('userlogindetails'), 'GRCMAZAGINE').toString(enc.Utf8)):{}

export default function Adminlogin() {
    
    const [email, Setemail] = useState('');
    const [password, Setpassword] = useState('');
    const [message, Setmessage] = useState('');
    const [userdata, Setuserdata] = useState('')

    const apiClient = axios.create({
        baseURL: "http://api.grcfincrimetoday.org",
        withCredentials: true
      });



    //   let userlogindetails = !!localStorage.getItem('userlogindetails')
      useEffect(()=>{
        // if(userlogindetails){
        //     let ans = localStorage.getItem('userlogindetails')
        //     let show = AES.decrypt(ans, 'GRCMAZAGINE').toString(enc.Utf8);
        //     let ring = JSON.parse(show)
        //     console.log(ring)
        //     if(ring.usertype === "Admin"){
        //         Setuserdata(ring)
        //      window.location.href =`http://localhost:3000/admin/list`
        //     }else{
        //         // window.location.href =`http://localhost:3000/admin/login`

        //     }
          
        //   }

        if(Object.keys(local).length === 0){
            console.log('nothing')
          }else{
              if(local.usertype === "Admin"){
                      Setuserdata(local)
             window.location.href =`http://127.0.0.1:3000/admin/list`
             }else{
              localStorage.clear();
              window.location.href='/'
              
             }
          }
      },[])

    const handleClick = ()=>{
        let formData = new FormData();
        // let headers = new Headers();
        // headers.append('Content-Type', 'application/json')
        formData.append('email',  email)
        formData.append('password',  password)
        let urltwo = `/api/adminlogin`;
        apiClient.get('/sanctum/csrf-cookie',{
       
        }).then( ()=> {
            apiClient.post(urltwo, formData, {
                headers:{
                    "Authorization":"Bearer "+userdata.token,
                    }
            }).then(res=>{
            console.log(res)
           if(res.data.success){
            //    res.data.data
            // Setmessage(res.data.message)
            const encrypt= AES.encrypt(JSON.stringify(res.data.data), 'GRCMAZAGINE').toString();
            // console.log(encrypt)
            localStorage.setItem('userlogindetails', encrypt);
            window.location.href = `http://127.0.0.1:3000/admin/list`;
           }

          })
        }).catch(err=>{
            let error = err.response.data.errors
            if(error.email){
             Setmessage(error.email[0])                          
            }else if(error.password){
              Setmessage(error.password[0])
            }else if(err.response.data.message === 'Unauthenticated.'){

                let myHeaders = new Headers();
                myHeaders.append("Authorization", "Bearer "+userdata.token);
                myHeaders.append("Content-Type", "application/json");
                var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
                };
                
                const url = 'http://api.grcfincrimetoday.org/api/logout';
                apiClient.get('/sanctum/csrf-cookie').then( ()=> { 
                fetch(url, requestOptions)
                .then(response => response.json())
                .then(result =>{
                    if(result.success){
                        localStorage.clear();
                        window.location.href='/'
                    }
                })
                .catch(error => console.log(error));
                   })
              
            }
        });
    }
    
    return (
        <div id="wrapper" className="flex flex-col justify-between h-screen">
        <div className="lg:p-16 max-w-xl lg:my-0 my-12 mx-auto p-6 space-y-">
                    <form className="lg:p-10 p-6 space-y-3 relative bg-white shadow-xl rounded-md">
                        <h1 className="lg:text-2xl text-xl font-semibold mb-6">Admin Login </h1>
                        <span className={message == "you logged in successfully" ?"text-lg font-semibold text-green-600":"text-lg font-semibold text-red-600"} > {message?message:""}</span>
                        <span id="message" className="lg:text-sm text-base font-normal mb-6 text-center flex flex-row items-center justify-center " >  </span>
                        <div>
                            <label className="mb-0" for=""> Email </label>
                            <input type="text" id="" placeholder="Name" value={email} onChange={(e)=>Setemail(e.target.value)} className="bg-gray-100 h-12 mt-2 px-3 rounded-md w-full Name"/>
                        </div>
                        {/* <div>
                            <label className="mb-0" for="">Birth date</label>
                            <input type="date" id="" placeholder="Info@example.com" className="bg-gray-100 h-12 mt-2 px-3 rounded-md w-full date"/>
                        </div> */}
        
                        <div>
                            <label className="mb-0" for="">Password </label>
                            <input type="text" id="" value={password} onChange={(e)=>Setpassword(e.target.value)} placeholder="Address" className="bg-gray-100 h-12 mt-2 px-3 rounded-md w-full Address"/>
                        </div>
        
                      
        
                    
                        <div>
                            <button type="button" id="btn" onClick={handleClick} className="bg-[#FF6600] font-semibold p-2.5 mt-5 rounded-md text-center text-white w-full btn">
                                Submit</button>
                        </div>
        
        
        {/* ghqsghqshg */}
            
                    </form>
                </div>
        
        
        </div>
        
    )
}
