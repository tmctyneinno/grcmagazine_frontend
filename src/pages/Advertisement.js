import React,{useEffect, useState} from 'react'
import Navbar from '../component/Navbar';
import axios from 'axios';
import { AES, enc } from 'crypto-js';
let local = localStorage.getItem('userlogindetails')?JSON.parse(AES.decrypt(localStorage.getItem('userlogindetails'), 'GRCMAZAGINE').toString(enc.Utf8)):{}

export default function Advertisement() {
     const [name, Setname] = useState("")
     const [email, Setemail] = useState("")
     const [price, Setprice] = useState("")
     const [companyname, Setcompanyname] = useState("")
     const [image, SetImage] = useState([])
     const [message, Setmessage] = useState("")
     const [userdata, Setuserdata] = useState(local?local:{});
     const [alert, Setalert] = useState("")
     const [isturn, Setisturn] = useState(false)
     const apiClient = axios.create({
        baseURL: "http://127.0.0.1:8000",
        withCredentials: true
      });
     const handleClick =()=>{
      Setisturn(true)
        if(image.type  === "image/png" || image.type === "image/jpg" || image.type === "image/jpeg"){
            let formData = new FormData();
            formData.append('name', name)
            formData.append('email', email)
             formData.append('companyname', companyname)
            formData.append('image', image)
            formData.append('message', message)
            let url = '/api/advestment';
            apiClient.get('/sanctum/csrf-cookie').then(()=>{
                apiClient.post(url, formData).then(res=>{
                 console.log(res)
                      if(res.data.success){
                        Setalert(res.data.success)
                        Setisturn(false)
                        //Setalert() 
                      }
             
                     }).catch(err=>{
                      let error = err.response.data.errors
                      if(error.name){
                          Setalert(error.name[0])    
                          Setisturn(false)
                       }else if(error.email){
                          Setalert(error.email[0])    
                          Setisturn(false)
                       }else if(error.price){
                          Setalert(error.price[0])   
                          Setisturn(false)
                       }else if(error.image){
                          Setalert(error.image[0])  
                          Setisturn(false)
                       }else if(error.message){
                          Setalert(error.message[0])  
                          Setisturn(false)
                       }
                     })
                    })                  
        }else{
          Setalert('please insert the correct image format')
        }
      

     }

  

    return (
        <div className='w-full bg-white'>
            <Navbar/>
            <article className='w-full bg-white py-2'>
                <section className='w-10/12 m-auto rounded-md mt-4 flex flex-col items-center shadow-md py-2'>
                <div className="section-header">
                                <p className="lead">Advertisement Enquiry</p>
                                <p className="messagex" ></p>
                            </div>
                            <section className={alert == 'we have received your enqiury'?"w-full text-center text-green-500 text-lg":"w-full text-center text-red-500 text-lg"} > {alert?alert:""} </section>

                <section className='w-11/12 flex flex-col items-center  sm:w-11/12 sm:flex sm:flex-col sm:items-center md:w-11/12 md:flex md:flex-row md:items-center  lg:w-11/12 lg:flex lg:flex-row lg:items-center space-x-2'>
                          <div className="w-full sm:w-full md:w-1/2 lg:w-1/2 flex flex-col items-center">
                           <section className='w-full text-left text-base text-black '>
                             Name
                           </section>
                           <article className='w-full flex items-center mt-3'>
                            <input type="text" className="w-full" value={name} onChange={(e)=>Setname(e.target.value)}  />
                           </article>
                          </div>


                          <div className="w-full sm:w-full md:w-1/2 lg:w-1/2 flex flex-col items-center">
                           <section className='w-full text-left text-base text-black '>
                             email
                           </section>
                           <article className='w-full mt-3 rounded-md flex items-center'>
                            <input type="email" value={email} onChange={(e)=>Setemail(e.target.value)} className="w-full" />
                           </article>
                          </div>
                         </section>



                         <section className='w-11/12 flex flex-col items-center mt-2  sm:w-11/12 sm:flex sm:flex-col sm:items-center sm:mt-2 md:w-11/12 md:flex md:flex-row md:items-center md:mt-2  lg:w-11/12 lg:flex lg:flex-row lg:items-center lg:mt-2 space-x-2'>
                       


                          <div className="w-full sm:w-full md:w-1/2 lg:w-1/2 flex flex-col items-center">
                           <section className='w-full text-left text-base text-black '>
                             Business name
                           </section>
                           <article className='w-full mt-3 rounded-md'>
                            <input type="email" value={companyname} onChange={(e)=>Setcompanyname(e.target.value)} className="w-full" />
                           </article>
                          </div>

                          <div className="w-full sm:w-full md:w-1/2 lg:w-1/2 flex flex-col items-center">
                           <section className='w-full text-left text-base text-black '>
                             Picture
                           </section>
                           <article className='w-full mt-3 rounded-md'>
                           <input type="file"   onChange={(e)=>SetImage(e.target.files[0])} className="w-full" />
                           </article>
                          </div>

                         </section>


                         {/* <section className='w-11/12 flex flex-col items-center mt-2  sm:w-11/12 sm:flex sm:flex-col sm:items-center sm:mt-2 md:w-11/12 md:flex md:flex-row md:items-center md:mt-2  lg:w-11/12 lg:flex lg:flex-row lg:items-center lg:mt-2 space-x-2'>
                          <div className="w-full sm:w-full md:w-full lg:w-full flex flex-col items-center">
                           <section className='w-full text-left text-base text-black '>
                             Picture
                           </section>
                           <article className='w-full'>
                           <input type="file"   onChange={(e)=>SetImage(e.target.files[0])} className="w-full" />
                           </article>
                          </div>
                         </section> */}


                         <section className='w-11/12 flex flex-col items-center mt-2  sm:w-11/12 sm:flex sm:flex-col sm:items-center sm:mt-2 md:w-11/12 md:flex md:flex-row md:items-center md:mt-2  lg:w-11/12 lg:flex lg:flex-row lg:items-center lg:mt-2 space-x-2'>
                          <div className="w-full sm:w-full md:w-full lg:w-full flex flex-col items-center">
                           <section className='w-full text-left text-base text-black '>
                             Message
                           </section>
                           <article className='w-full'>
                           <textarea className="form-control" value={message} onChange={(e)=>Setmessage(e.target.value)} id="messagecontact" name="textarea" rows="6" placeholder="Message"></textarea>

                           </article>
                          </div>
                         </section>

                         <section className='w-11/12 flex flex-col items-center mt-2 justify-center  sm:w-11/12 sm:flex sm:flex-col sm:items-center sm:justify-center sm:mt-2 md:w-11/12 md:flex md:flex-row md:items-center md:mt-2  md:justify-center lg:w-11/12 lg:flex lg:flex-row lg:items-center lg:justify-center lg:mt-2 space-x-2'>

                            <button type="button" onClick={handleClick} className='w-2/3 bg-[#FF6600] text-white text-lg text-center py-2 rounded-md'>
                             {isturn?'Please Wait...':'Submit'}    
                            </button>
                          </section>
                         

                </section>
            </article>  
        </div>
    )
}
