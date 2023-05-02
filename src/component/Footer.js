import React,{useState} from 'react'
import { AES, enc } from 'crypto-js';
import axios from 'axios';
import { BsFacebook, BsInstagram, BsTwitter, BsLinkedin } from 'react-icons/bs';
import { Link } from 'react-router-dom';
let local = localStorage.getItem('userlogindetails')?JSON.parse(AES.decrypt(localStorage.getItem('userlogindetails'), 'GRCMAZAGINE').toString(enc.Utf8)):{}

export default function Footer() {
    const [userdata, Setuserdata] = useState(local?local:{});
    const [mail, Setmail] = useState('')
    const apiClient = axios.create({
        baseURL: "http://127.0.0.1:8000",
        withCredentials: true
      });

    const handleSub = ()=>{
        if(mail != ""){
            let formData = new FormData();
            formData.append('email', mail)
            let urltwo = '/api/insertnotify';
            apiClient.get('/sanctum/csrf-cookie').then(()=>{
              apiClient.post(urltwo, formData, {
                headers:{
                    "Authorization":"Bearer "+userdata.token,
                    }
              }).then(res=>{
                 console.log(res)
              }).catch(err=>{
    
    
              })
    
            })
        }
     
    }
    return (
        <div>
   {/* BsFacebook, BsInstagram, BsTwitter, BsLinkedin */}
<div className="footer">
        <div className="container">
            <div className="row">
                <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12 nopadding">
                    <Link to="/">
                    <div className="footer-logo">
                        <img src="https://res.cloudinary.com/the-morgans-consortium/image/upload/v1679299410/Grc%20magazine/GRC_Fincrime_mrzg31.png" alt=""/>
                    </div>
                    </Link>
                   
                </div>
                <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12 nopadding">
                    <div className="footer-social text-center">
                        <h2 className="widget-title">Follow Us On</h2>
                        <ul className="listnone">
                            <li className='grid place-content-center text-center outline-none'><a className='grid place-content-center outline-none'><BsFacebook className='w-full h-full'/></a></li>
                            <li className='grid place-content-center text-center outline-none'><a className='grid place-content-center outline-none'><BsInstagram className='w-full h-full' /></a></li>
                            <li className='grid place-content-center text-center outline-none'><a className='grid place-content-center outline-none'><BsTwitter className='w-full h-full' /></a></li>
                            <li className='grid place-content-center text-center outline-none'><a className='grid place-content-center outline-none'><BsLinkedin className='w-full h-full' /></a></li>
                        </ul>
                    </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12 nopadding grid place-content-center">
                    <div className="w-full">
                     <span className='text-base text-[#FF6600] capitalize px-2 py-2 text-center'>
                         Please Enter email to get notifications about new article
                     </span>
                    </div>

                    <div className='w-full flex flex-row items-center justify-center space-x-2'>
                        <section className='w-3/5'>
                            <input type="email" onChange={(e)=>Setmail(e.target.value)}  className='w-full p-3' placeholder='Enter email to subscribe' />
                        </section>
                        <section className='w-1/12'>
                             <button className='bg-[#FF6600]  text-white h-10 rounded-md  px-3' onClick={handleSub}>
                                submit
                             </button>
                        </section>
                    </div>
             
                </div>
            </div>
        </div>
    </div>
    <div className="tiny-footer">
        <div className="container">
            <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                </div>
            </div>
        </div>
    </div>
    <div className="modal fade search-modal">
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="input-group">
                            <input type="text" className="form-control" placeholder="Search for..."/>
                            <span className="input-group-btn">
                        <button className="btn btn-default" type="button">Go!</button>
                         </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

        </div>
    
    )
}
