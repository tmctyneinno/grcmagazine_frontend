import React, {useEffect, useState, useContext} from 'react'
import Navbar from '../component/Navbar';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Footer from '../component/Footer';
import { BsFacebook, BsInstagram, BsTwitter, BsLinkedin } from 'react-icons/bs';
import { Markup } from 'interweave';
import axios from 'axios';
import { motion } from "framer-motion"
import { AES, enc } from 'crypto-js';
import Pusher from 'pusher-js';
import Echo from 'laravel-echo';
import AdvertPart from '../component/AdvertPart';
import { context } from '../component/Context';
import { useNavigate } from 'react-router-dom';
let local = localStorage.getItem('userlogindetails')?JSON.parse(AES.decrypt(localStorage.getItem('userlogindetails'), 'GRCMAZAGINE').toString(enc.Utf8)):{}

export default function Home() {
    const [AI, Setai] = useState([])
    const [Banking, SetBanking] = useState([])
    const [Covid, Setcovid] = useState([])
    const [categoriesdata, Setcategoriesdata] =  useState([])
    const [cybersecurity, Setcybersecurity] = useState([])
    const [latest, Setlatest] = useState({})
    const [mainsildes, Setmainsildes] = useState([])
    const [recent, Setrecent] = useState([])
    const [userdata, Setuserdata] = useState(local?local:{})
    const [sent, Setsent] = useState(false)
    const [num, Setnum] = useState(0)
    const [adsnormal, Setadsnormal] = useState([])
    const [isnotnormalads, Setisnotnormalads] = useState([])
    const apiClient = axios.create({
        baseURL: "http://127.0.0.1:8000",
        withCredentials: true
      });
    // subscription, userdata.token
    const navigate = useNavigate();
    const variants = {
        open: { opacity: 1, display:"block" },
        closed: { opacity: 0, display:"none" },
      }
      
      const content = useContext(context)
        let onlineuser = content.onlineuser
        let Setonlineuser = content.Setonlineuser


    let images = [
        'https://res.cloudinary.com/the-morgans-consortium/image/upload/v1677477092/GRC_Magine_upload/hntcl4pbuin6vvcnyav3.jpg',
        'https://res.cloudinary.com/the-morgans-consortium/image/upload/v1677181570/GRC_Magine_upload/swdbyiszzspyhftnfs83.jpg',
        'https://res.cloudinary.com/the-morgans-consortium/image/upload/v1676902198/GRC_Magine_upload/znwegs9dgjuxryumim34.jpg'
       ];
      useEffect(()=>{
   

            apiClient.get('/sanctum/csrf-cookie').then( ()=> {
                let url = '/api/home/';
                apiClient.get(url).then(res=>{
               
                 Setai(res.data.AI)
                 SetBanking(res.data.Banking)
                 Setcovid(res.data.Covid)
                 Setcategoriesdata(res.data.categoriesdata)
                 Setcybersecurity(res.data.cybersecurity)
                 Setlatest(res.data.latest)
                 Setmainsildes(res.data.mainsildes)
                 Setrecent(res.data.recent)
                })
          })


        apiClient.get('/sanctum/csrf-cookie').then( ()=> {
            let url = '/api/activeadds/';
            apiClient.get(url).then(res=>{
           
            })
      })



    apiClient.get('/sanctum/csrf-cookie').then( ()=> {
        let url = '/api/showads/';
        apiClient.get(url).then(res=>{
             if(res.data.success){
                let data = res.data.success
                 let ansnormal = data.filter((item)=>item.adname == 'normal' && item.status == 'Active')
                let ansnotnormal =  data.filter((item)=>item.adname != 'normal' && item.status == 'Active')
                Setadsnormal(ansnormal)
                Setisnotnormalads(ansnotnormal)
             }
        //    Setadsnormal
        })
  })

//   console.log(adsnormal)
   

          apiClient.get('/sanctum/csrf-cookie').then( ()=> {
            let url = '/api/subscription';
            apiClient.get(url, {
              headers:{
                "Authorization":"Bearer "+userdata.token,
                }
            }).then(res=>{
                // console.log(res)
               Setsent(res.data.success)
                // if(res.data.data){
                //   Setdata(res.data.data)
                //   Setlast(res.data.last_page)
                // }
              
            })
        })

        if(Object.keys(local).length === 0){
            console.log('nothing')
          }else{
            window.Pusher = Pusher;
            window.Echo = new Echo({
                broadcaster: 'pusher',
                key: 'f959c4bf7c6b75daca59',
                cluster: 'eu',
                encrypted:true,
                forceTLS: true,
                enabledTransports: ['ws', 'wss'],
               authEndpoint : 'http://127.0.0.1:8000/broadcasting/auth',
             auth:{
                 headers:{
                     Authorization: "Bearer " +userdata.token,
                     Accept: "application/json",
                 }
             }
              });
              window.Echo.join('chat')
              .here((user)=>{
                  console.log(user)
                  Setonlineuser(user)
              }).joining((we) => {
                //   console.log(we)
                  let ansdata = onlineuser.map((item)=>item.id  == we.id)
                  let answer = ansdata.includes(true);
                  // axios.put('/api/user/'+local.id+'/online?api_token='+userdata.token, {});
                  if(answer == true){
                      console.log('you cant insert the same value twice')
                 }else{
                  let dataans = [...onlineuser, we]
                  Setonlineuser(dataans)
                 }
              }).leaving((user)=>{
                  console.log(user)
                 let ansdata = onlineuser.filter((item)=>item.id !== user.id)
                 Setonlineuser(ansdata)
              })
              .listen('.userline', (e) => {
                //   console.log(e)
                  // this.friend = e.user;
              });

          }
    

      },[])


      useEffect(()=>{
        if(adsnormal.length > 1){
            const inter =   setInterval(
                () => Setnum((num + 1) % adsnormal.length),
                7000
              );
            return ()=>clearInterval(inter)
        }
       
    },[num])

    // console.log(sent)

    let url = window.location.origin
   const handleRead =(id)=>{
    // window.location.href = `${url}/single/${id}`;
     if(Object.keys(local).length === 0){
        navigate(`${url}/subscribe`)
     }else{

        if(sent === false){
            navigate(`/subscribe`)

        }else{
            navigate(`/single/${id}`)
        }
     }
   }

   const handleStories = ()=>{
    navigate(`/lists`)

   }




    return (
        <div className='w-full'>
         <Navbar/>
          {/*  end */}

          <article className='w-full'>
    <div className="post-slider">
        <div className="container">
            <div className="row">
                <div className="col-lg-12 col-sm-12 col-md-12 col-xs-12">

                    <div className="slider" id="slider">
                    <Carousel  infiniteLoop useKeyboardArrows autoPlay swipeable={false} dynamicHeight={true} showThumbs={false} showArrows={false} width={'100%'}>
                       {mainsildes.length > 0? 
                       mainsildes.map((item)=>{
                        return <div className="slider-img "><img src={item.picture?item.picture:''} alt=" " className="img-responsive" />
                        <div className="row cursor-pointer">
                            <div className="col-lg-5 col-md-5 col-sm-6 col-xs-9">
                                <div className=" slider-captions ">
                            <h1 className="slider-title"><Markup content={item.articlename} /></h1>
                                    <p className="meta"><span className="meta-category"><a  className="meta-link">year</a></span> <span className="meta-date"> 2002 </span> <span className="meta-comments"> </span>
                                    </p>
                                    <p className="slider-text hidden-xs"> <Markup content={item.articlebodyone.substring(0,100)} /> </p>
                                    <a onClick={()=>handleRead(item.ansid)} className="btn-link hidden-xs">Read More..</a> 
                                    </div>
                            </div>
                        </div>
                    </div>
                       })
                       
                       :[]}   
                   

                      </Carousel>
                    </div>

                </div>
            </div>
        </div>
    </div>


    <div className="space-small">
        <div className="container">
            <div className="row">
                <div className="col-lg-8 col-sm-8 col-md-8 col-xs-12">
                    <div className="row">
                        <div className="col-lg-12 col-sm-12 col-md-12 col-xs-12">
                            <div className="section-header">
                                <h2 className="heading-line">latest articles</h2>
                            </div>
                        </div>
                        <div className="col-lg-12 col-sm-12 col-md-12 col-xs-12">

                            <div className="post-vertical-block">
                                <div className="featured-img">
                                    <a onClick={()=>handleRead(latest.id)} className="imagehover"><img src={latest.picture} alt="" /></a>
                                </div>
                                <div className="post-vertical-content">
                                    <h2>
                                        <a onClick={()=>handleRead(latest.id)} className="post-title cursor-pointer"><Markup content={latest.articlename} /></a>
                                        </h2>
                                    <p className="meta"><span className="meta-category"><a onClick={()=>handleRead(latest.id)} className="meta-link">Year</a></span> 
                                    <span className="meta-date">{ latest.yearup }</span> 
                                    <span className="meta-comments"> <a onClick={()=>handleRead(latest.id)} className="meta-link"></a></span>
                                    </p>
                                    <p>< Markup content={latest.articlebodyone?latest.articlebodyone.substring(0, 170):""} /></p>
                                    <a onClick={()=>handleRead(latest.id)} className="btn-link">Read More..</a>
                                </div>
                            </div>


                        </div>

                    </div>
                    <div className="row">
                        <div className="col-lg-12 col-sm-12 col-md-12 col-xs-12">
                            <div className="section-header flex items-center justify-between">
                                <h2 className="heading-line">Artificial Intelligence</h2>
                                <a onClick={handleStories} className="btn btn-primary btn-xs pull-right cursor-pointer"> SEE ALL POSTS</a>
                            </div>
                        </div>
                        {AI.length > 0?
                        AI.map((item)=>{
                            return <div className="col-lg-6 col-sm-6 col-md-6 col-xs-12 cursor-pointer">
                            <div className="post-vertical-block">
                                <div className="featured-img">
                                    <a  className="imagehover"><img src={item.picture} alt="" /></a>
                                </div>
                                <div className="post-vertical-content">
                                    <h2><a onClick={()=>handleRead(item.id)} className="post-title"> <Markup content={item.articlename} /> </a></h2>
                                    <p className="meta"><span className="meta-category"><a onClick={()=>handleRead(item.id)} className="meta-link">year</a></span> <span className="meta-date">{ item.yearup }</span> <span className="meta-comments"> </span>
                                    </p>
                                    <p><Markup content={item.articlebodyone.substring(0,100)} />...</p>
                                    <a  className="btn-link">Read More..</a>
                                </div>
                            </div>
                        </div>
                        })
                        :[]}
                    

                    </div>
                    <div className="row">
                        <div className="col-lg-12 col-sm-12 col-md-12 col-xs-12">
                            <div className="section-header flex items-center justify-between">
                                <h2 className="heading-line">Banking</h2>
                                <a onClick={handleStories} className="btn btn-primary btn-xs pull-right cursor-pointer"> SEE ALL POSTS</a>
                            </div>
                        </div>
                        {Banking.length > 0?
                        Banking.map((item)=>{
                            return <div className="col-lg-6 col-sm-6 col-md-6 col-xs-12 cursor-pointer">
                            <div className="post-vertical-block">
                                <div className="featured-img">
                                    <a href="#" className="imagehover"><img src={item.picture} alt="" /></a>
                                </div>
                                <div className="post-vertical-content">
                                    <h2><a onClick={()=>handleRead(item.id)} className="post-title"> <Markup content={item.articlename} /> </a></h2>
                                    <p className="meta"><span className="meta-category"><a onClick={()=>handleRead(item.id)} className="meta-link">year</a></span> <span className="meta-date">{ item.yearup }</span> <span className="meta-comments"> </span>
                                    </p>
                                    <p><Markup content={item.articlebodyone.substring(0,100)} />...</p>
                                    <a  className="btn-link">Read More..</a>
                                </div>
                            </div>
                        </div>
                        })
                        :[]}
                    </div>
                    <div className="row">
                        <div className="col-lg-12 col-sm-12 col-md-12 col-xs-12">
                            <div className="section-header flex items-center justify-between">
                                <h2 className="heading-line">Covid-19</h2>
                                <a onClick={handleStories} className="btn btn-primary btn-xs pull-right cursor-pointer"> SEE ALL POSTS</a>
                            </div>
                        </div>
                        {Covid.length > 0?
                        Covid.map((item)=>{
                            return <div className="col-lg-6 col-sm-6 col-md-6 col-xs-12 cursor-pointer">
                            <div className="post-vertical-block">
                                <div className="featured-img">
                                    <a href="#" className="imagehover"><img src={item.picture} alt="" /></a>
                                </div>
                                <div className="post-vertical-content">
                                    <h2><a onClick={()=>handleRead(item.id)} className="post-title"> <Markup content={item.articlename} /> </a></h2>
                                    <p className="meta"><span className="meta-category"><a onClick={()=>handleRead(item.id)} className="meta-link">year</a></span> <span className="meta-date">{ item.yearup }</span> <span className="meta-comments"> </span>
                                    </p>
                                    <p><Markup content={item.articlebodyone.substring(0,100)} />...</p>
                                    <a  className="btn-link">Read More..</a>
                                </div>
                            </div>
                        </div>
                        })
                        :[]}


                    </div>
                    <div className="row">
                        <div className="col-lg-12 col-sm-12 col-md-12 col-xs-12">
                            <div className="section-header flex items-center justify-between">
                                <h2 className="heading-line">Cybersecurity</h2>
                                <a onClick={handleStories} className="btn btn-primary btn-xs pull-right cursor-pointer"> SEE ALL POSTS</a>
                            </div>
                        </div>
                        {cybersecurity.length > 0?
                        cybersecurity.map((item)=>{
                            return <div className="col-lg-6 col-sm-6 col-md-6 col-xs-12 cursor-pointer">
                            <div className="post-vertical-block">
                                <div className="featured-img">
                                    <a href="#" className="imagehover"><img src={item.picture} alt="" /></a>
                                </div>
                                <div className="post-vertical-content">
                                    <h2><a onClick={()=>handleRead(item.id)} className="post-title"> <Markup content={item.articlename} /> </a></h2>
                                    <p className="meta"><span className="meta-category"><a onClick={()=>handleRead(item.id)} className="meta-link">year</a></span> <span className="meta-date">{ item.yearup }</span> <span className="meta-comments"> </span>
                                    </p>
                                    <p><Markup content={item.articlebodyone.substring(0,100)} />...</p>
                                    <a  className="btn-link">Read More..</a>
                                </div>
                            </div>
                        </div>
                        })
                        :[]}

<section className={isnotnormalads.length > 0?"w-full flex flex-col items-center mt-2":'hidden' } >
                     <div className='text-center text-2xl text-[#FF6600] text-[#FF660]'>
                        Advertisement
                     </div>
                     {isnotnormalads.length > 0?<AdvertPart  isnotnormalads={isnotnormalads}/>:""}
                   
                    </section>

                    </div>
                   
                </div>

                
                <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div className="widget widget-categories">
                                <h2 className="widget-title">categories</h2>

                                <ul className="firstmain cursor-pointer">
                                    {categoriesdata.length > 0?
                                    categoriesdata.map((item)=>{
                                        if(item.categories != 'Introduction'){
                                        return  <li><a >{item.categories}</a><span class="badge">{item.number}</span></li>
                                        }
                                    })
                                    :[]} 


                                </ul>
                            </div>
                        </div>
              
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div className="widget widget-social">
                                <h2 className="widget-title">Share with us</h2>
                                <ul>
                                             
                                    <li><a className='flex flex-row items-center space-x-1'> <BsFacebook className='text-lg text-black' /> Facebook  </a></li>
                                    <li><a  className='flex flex-row items-center space-x-1'><BsTwitter className='text-lg text-black' />Twitter  <i className="fa-brands fa-twitter pull-right widget-social-icon"></i></a></li>
                                    <li><a className='flex flex-row items-center space-x-1'><BsInstagram className='text-lg text-black' /> Instagram <i className="fa-brands fa-instagram pull-right widget-social-icon"></i></a></li>
                                    <li><a className='flex flex-row items-center space-x-1'>< BsLinkedin className='text-lg text-black'/> Linkedin<i className="fa-brands  fa-linkedin pull-right widget-social-icon"></i></a></li>

                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div className="widget widget-recent-news">
                                <h2 className="widget-title">Recent news</h2>
                                <ul>

                                    {recent.length > 0?
                                     recent.map((item)=>{
                                        return  <li>
                                        <h4><a onClick={()=>handleRead(item.id)} className="post-title"><Markup content={item.articlename} /></a></h4>
                                        <p className="meta"><span className="meta-category"><a onClick={()=>handleRead(item.id)} className="meta-link">{ item.categories }</a></span> <span className="meta-date">{ item.yearup }</span>
                                        </p>
                                    </li>
                                     })
                                    :[]}
                                </ul>
                            </div>
                        </div>

                        <div className={adsnormal.length > 0?"col-lg-12 col-md-12 col-sm-12 col-xs-12":'hidden' }   >
                            <div className="widget widget-recent-news">
                                <h2 className="widget-title" data-id="Adsone">Advertisement</h2>
                                <ul>
                                 <li>
                                    {adsnormal.length > 0?
                                    adsnormal.map((item, index)=>{
                                  
                                        return <motion.div
                                        animate={num === index ? "open" : "closed"}
                                        variants={variants}
                                        className='w-full h-full relative'>
                                        <img src={item.image} className="w-full" />
                                                <span className='w-full h-full z-10 text-white absolute top-0 bg-cover bg-opacity-10 bg-black grid place-content-center'>
                                                 {item.companyname}
                                                </span>
                                             </motion.div>
                                    })
                                    
                                    :""}
                                
                                     
                                 </li>
                                </ul>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    </div>



</article>



          {/* end */}
          <Footer/>
        </div>
    )
}
