import React,{useEffect, useState} from 'react'
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';
import { BsFacebook, BsInstagram, BsTwitter, BsLinkedin } from 'react-icons/bs';
import { AiOutlineMail, AiFillPhone, AiFillHome } from 'react-icons/ai';
import {FaAddressBook} from 'react-icons/fa';
import { Markup } from 'interweave';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
export default function Contact() {
    const [recent, Setrecent] = useState([]);
    const [email, Setemail] = useState([]);
    const [message, Setmessage] = useState([]);
    const [name, Setname] = useState([]);
    const [alert, Setalert] = useState('');
    const [isload, Setisload] = useState(false)
    const apiClient = axios.create({
        baseURL: "http://api.tmcinstitute.com",
        withCredentials: true
      });
  
    const navigate = useNavigate();

    let url = window.location.origin
    const handleRead =(id)=>{
    //   window.location.href = `${url}/single/${id}`;
      navigate(`/single/${id}`)

    }

    const handlContact =()=>{
        // contact
        // 'name'=>$request->name,
        // 'email'=>$request->email,
        // 'message'=>$request->message
        Setisload(false)
    let formData = new FormData();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json')
    formData.append('name',  name)
    formData.append('email',  email)
    formData.append('message', message)
    let urltwo = '/api/contact';
    apiClient.get('/sanctum/csrf-cookie').then(()=>{
      apiClient.post(urltwo, formData, headers).then(res=>{
        if(res.data.success){
            Setisload(true)
        }
      })
    })
    }


    return (
        <section>
            <Navbar/>
                    <div className="container">
        <div className="row">
            <div className="col-lg-12 col-sm-12 col-md-12 col-xs-12">
                <div className="page-breadcrumb">
                    <ol className="breadcrumb">
                        <li><a href="index.html">Home</a></li>
                        <li className="active">Contact us</li>
                    </ol>
                </div>
            </div>
            <div className="col-lg-12 col-sm-12 col-md-12 col-xs-12">
                <div className="page-section">
                    <h1 className="page-title">Contact us</h1></div>
            </div>
        </div>
    </div>
    
    <div className="content">
        <div className="container">
            <div className="row">
                <div className="col-lg-8 col-sm-8 col-md-8 col-xs-12">
                    <div className="row">
                        <div className="col-lg-12 col-sm-12 col-md-12 col-xs-12">
                            <div className="section-header">
                                <p className="lead">We’d love to receive your feedback on our magazine’s articles and the editorial style!</p>
                                <p className="messagex" > {alert?alert:" "}</p>
                            </div>
                        </div>
                        <div className="col-lg-12 col-sm-12 col-md-12 col-xs-12">
                            <form className="contact-form">
                                <div className="flex flex-col items-center">
                                    <section className='flex flex-col sm:flex sm:flex-col  md:flex md:flex-row   lg:flex lg:flex-row items-center space-x-2 w-full'>

                                    <div className="w-full sm:w-full md:w-1/2 lg:w-1/2">
                                        <div className="w-full">
                                            <label className="w-full" >Name<span className='text-red-400'>*</span></label>
                                            <input value={name} onChange={(e)=>Setname(e.target.value)} name="name" type="text" placeholder="Name" className="w-full" />
                                        </div>
                                    </div>

                                    <div className="w-full sm:w-full md:w-1/2 lg:w-1/2">
                                        <div className="w-full">
                                            <label className="w-full" >E-mail<span className='text-red-400'>*</span></label>
                                            <input name="email" value={email} onChange={(e)=>Setemail(e.target.value)} type="email" placeholder="E-mail" className="w-full" />
                                        </div>
                                    </div>
                                    </section>
                                   
                                 
                                    <div className="w-full mt-2">
                                        <label className="w-full" >Message</label>
                                        <textarea className="form-control" value={message} onChange={(e)=>Setmessage(e.target.value)} id="messagecontact" name="textarea" rows="6" placeholder="Message"></textarea>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            {/* btn btn-default */}
                                            <button id="singlebutton" name="singlebutton" className="py-3 rounded-sm w-32 bg-[#FF6600] text-white" onClick={handlContact}>
                                                
                                                {isload?'Please ':'Submit'}
                                                </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="col-lg-12 col-sm-12 col-md-12 col-xs-12">
                            <div className="conatct-info">
                                <div className="section-header">
                                    <h2 className="heading-line">We Are Here To Help You</h2>
                                </div>
                                <div className="contact-details">
                                    <div className="row">
                                        <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2">
                                            <div className="contact-icon">
                                                <AiOutlineMail/>
                                            </div>
                                        </div>
                                        <div className="col-lg-10 col-md-10 col-sm-10 col-xs-10">
                                            <h4 className="contact-title">Email</h4>
                                            <p>info@wedpress.com</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="contact-details">
                                    <div className="row">
                                        <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2">
                                            <div className="contact-icon">
                                                <AiFillHome/>

                                            </div>
                                        </div>
                                        <div className="col-lg-10 col-md-10 col-sm-10 col-xs-10">
                                            <h4 className="contact-title">Address</h4>
                                            <p>Nigeria: 2nd Floor 1, Adeola Adeoye Street Off Toyin Street ikeja, Lagos Nigeria</p>
                                            <p>United Kingdom: 24 Holborn Viaduct London EC1A 2BN United Kingdom</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="contact-details">
                                    <div className="row">
                                        <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2">
                                            <div className="contact-icon">
                                                <AiFillPhone/>
                                            </div>
                                        </div>
                                        <div className="col-lg-10 col-md-10 col-sm-10 col-xs-10">
                                            <h4 className="contact-title">Phone</h4>
                                            <p>+23417001770</p>
                                            <p>09153414314</p>
                                            <p>+44-7466588324</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
          
                    </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div className="widget widget-categories">
                                <h2 className="widget-title">categories</h2>
                                <ul>
                                    <li><a href="#">Planning</a> <span className="badge">6</span></li>
                                    <li><a href="#">Real Weddings</a><span className="badge">2</span></li>
                                    <li><a href="#">Fashion</a><span className="badge">9</span></li>
                                    <li><a href="#">Gallery</a><span className="badge">4</span></li>
                                    <li><a href="#">Destinations</a><span className="badge">8</span></li>
                                </ul>
                            </div>
          
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                   
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div className="widget widget-social">
                                <h2 className="widget-title">Share with us</h2>
                                <ul>
                                             
                                             <li><a classNameName='flex flex-row items-center space-x-1'> <BsFacebook classNameName='text-lg text-black' /> Facebook  </a></li>
                                             <li><a  classNameName='flex flex-row items-center space-x-1'><BsTwitter classNameName='text-lg text-black' />Twitter  <i classNameName="fa-brands fa-twitter pull-right widget-social-icon"></i></a></li>
                                             <li><a classNameName='flex flex-row items-center space-x-1'><BsInstagram classNameName='text-lg text-black' /> Instagram <i classNameName="fa-brands fa-instagram pull-right widget-social-icon"></i></a></li>
                                             <li><a classNameName='flex flex-row items-center space-x-1'>< BsLinkedin classNameName='text-lg text-black'/> Linkedin<i classNameName="fa-brands  fa-linkedin pull-right widget-social-icon"></i></a></li>
         
                                         </ul>
                            </div>
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div className="widget widget-recent-news">
                                <h2 className="widget-title">Recent news</h2>
                                <ul>
                                {
                                    recent.length >0?
                                    recent.map((item)=>{
                                    return <li>
                                    <h4><a  onClick={()=>handleRead(item.id)} classNameName="post-title">< Markup content={item.articlename} /></a></h4>
                                    <p classNameName="meta"><span classNameName="meta-category"><a  onClick={()=>handleRead(item.id)} classNameName="meta-link">{ item.categories }</a></span> <span classNameName="meta-date">{ item.yearup }</span>
                                    </p>
                                </li>
                                    })
                                    :""
                                  }
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    
    
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Footer/>
        </section>
    
    )
}
