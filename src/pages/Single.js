import React,{useEffect, useState} from 'react'
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';
import { useParams } from 'react-router-dom';
import { BsFacebook, BsInstagram, BsTwitter, BsLinkedin } from 'react-icons/bs';
import axios from 'axios';
import { AES, enc } from 'crypto-js';
import { Markup } from 'interweave';
import Pusher from 'pusher-js';
import {AiFillPushpin} from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import Echo from 'laravel-echo';
let local = localStorage.getItem('userlogindetails')?JSON.parse(AES.decrypt(localStorage.getItem('userlogindetails'), 'GRCMAZAGINE').toString(enc.Utf8)):{};

export default function Single() {
    // console.log(local)
    const apiClient = axios.create({
        baseURL: "http://api.grcfincrimetoday.org",
        withCredentials: true
      });

      const navigate = useNavigate();

  const [findno, Setfindno] = useState({})
  const [realted, Setrealted] = useState([])
  const [recent, Setrecent] = useState([])
  const [categoriesdata, Setcategoriesdata] = useState([])
  const [comment, Setcomment] = useState([])
  const [name, Setname] = useState('')
  const [message, Setmessage] = useState('');
  const [email, Setemail] = useState('')
  const [artcleid, Setartcleid] = useState('')
  const [comment_id, Setcommentid] = useState('')
  const [sent, Setsent] = useState(false)
  const [currentNum, SetcurrentNum] = useState(null)
  const [showid, Setshowid] = useState(null)
  const [reportid, Setreportid] = useState('')
  const [reportmessage, Setreportmessage] = useState('')
  let {slug} = useParams()
  useEffect(()=>{
    if(slug){
        apiClient.get('/sanctum/csrf-cookie').then( ()=> {
            let url = '/api/single/'+slug;
            apiClient.get(url).then(res=>{
                console.log(res)
                Setrealted(res.data.relatedtopic)
                Setfindno(res.data.findno)
                Setrecent(res.data.recent)
                Setcategoriesdata(res.data.categoriesdata)
                Setcomment(res.data.comment)
                Setartcleid(res.data.article_id)
            })
      })
    
    
      }else{
    
      }


    //   apiClient.get('/sanctum/csrf-cookie').then( ()=> {
    //     let url = '/api/subscription';
    //     apiClient.get(url, {
    //       headers:{
    //         "Authorization":"Bearer "+local.token,
    //         }
    //     }).then(res=>{
    //     //    console.log(res)
    //        Setsent(res.data)
    //         // if(res.data.data){
    //         //   Setdata(res.data.data)
    //         //   Setlast(res.data.last_page)
    //         // }
    //       if(res.data == false){
    //         window.location.href = `${url}/lists`;
    //       }
    //     })
    // })
  },[])

  useEffect(()=>{

    if(Object.keys(local).length === 0){

      }else{
          if(local.usertype === "Admin" || local.usertype === "User" ){
            Setname(local.name)
            Setemail(local.email)
         }else{

        }
      } 

  },[])

  let url = window.location.origin
  const handleRead =(id)=>{
  //  window.location.href = `${url}/single/${id}`;
  if(Object.keys(local).length === 0){
        
  }else{
    if(sent === false){
        console.log('not working');
      }else{
        navigate(`/single/${id}`)
        //   window.location.href = `${url}/single/${id}`;
      }         
     }
  }


  useEffect(()=>{


    window.Echo = new Echo({
        broadcaster: 'pusher',
        key: 'f959c4bf7c6b75daca59',
        cluster: 'eu',
        encrypted:true,
        forceTLS: true,
      });

      var channel = window.Echo.channel(`broadcastdata`);
      channel.listen('.comment',function(data) {
        console.log(data)
         Setcomment(data.data)
      })
  },[])


  useEffect(()=>{
    window.Echo = new Echo({
        broadcaster: 'pusher',
        key: 'f959c4bf7c6b75daca59',
        cluster: 'eu',
        encrypted:true,
        forceTLS: true,
      });

      var channel = window.Echo.channel(`replieschannel`);
      channel.listen('.repliesas',function(data) {
       console.log(data)
        Setcomment(data.data)
      })
  },[])


  const  handleClicks = (e)=>{
    e.preventDefault();
    if(message !== "" && name !== "" && email !== ""){
        let formData = new FormData();
        formData.append('message', message)
        formData.append('name', name)
        formData.append('email', email)
        formData.append('articles_id', artcleid)
        apiClient.get('/sanctum/csrf-cookie').then( ()=> {
            apiClient.post(`/api/artclesinsert`, formData).then(res=>{

             console.log(res)
             if(res.data.success){
                Setmessage('')

             }
            }).catch(err=>{
          let error = err.response.data.errors
          if(error.name){
            //   error.name[0]
            }else if(error.email){
            //   error.email[0]
            }else if(error.message){
            //   error.message[0]
            }
    
      })
        })
    }
 
  

  }

  const handleSoon =(xoxo)=>{
    if(currentNum == null){
        SetcurrentNum(xoxo)
  
    }else{
        SetcurrentNum(null) 
    }
  
  }

//   

const handleRex =(id)=>{
    Setcommentid(id)
    SetcurrentNum(null) 
}

const handleReply = (e)=>{
    // console.log('gfhhgfhghg')
    console.log(comment_id)
    e.preventDefault();
    if(comment_id !== ''){
        let formData = new FormData();
        formData.append('message', message)
        formData.append('name', name)
        formData.append('email', email)
        formData.append('articles_id', artcleid)
        formData.append('comment_id', comment_id)
        apiClient.get('/sanctum/csrf-cookie').then( ()=> {
            apiClient.post('/api/replies', formData).then(res=>{
            //  console.log(res)
             if(res.data.success){
                Setcommentid('') 
                SetcurrentNum(null) 
                Setmessage('')
             }
            }).catch(err=>{})
        })
    }

}


const handleSee =(showidx)=>{
    if(showid === null){
        Setshowid(showidx)
    }else{
        Setshowid(null)
    }
 
}

const handledel = (id)=>{

    // {
    //     headers:{
    //       "Authorization":"Bearer "+local.token,
    //       }
    //   }

    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer "+local.token);
    myHeaders.append("Content-Type", "application/json");
 

    var raw = JSON.stringify({
      'comment_id':id,
      'articles_id':artcleid
    });
    
    var requestOptions = {
      method:'DELETE',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
     apiClient.get('/sanctum/csrf-cookie').then( ()=> { 
      let url = 'http://api.grcfincrimetoday.org/api/deletecomment';
        fetch(url, requestOptions)
        .then(response => response.json())
        .then(result =>{
        //   console.log(result)
             if(result.success){


             }else{

             }
        })
     })
}

const handlereport =(id)=>{
    Setreportid(id)
}


const handleSubmitReport =()=>{
   if(reportid !== ""){

      let formData = new FormData();
        formData.append('message', reportmessage)
        formData.append('comment_id', reportid)
        apiClient.get('/sanctum/csrf-cookie').then( ()=> {
            apiClient.post('/api/report', formData, {
                headers:{
                    "Authorization":"Bearer "+local.token,
                }
            }).then(res=>{
            //  console.log(res)
             if(res.data.success){
                Setreportid('')

             }
            }).catch(err=>{})
        })
   }

}

const handlepin =(id)=>{

    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer "+local.token);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      'comment_id':id,
      'articles_id':artcleid
    });

    var requestOptions = {
        method:'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      apiClient.get('/sanctum/csrf-cookie').then( ()=> { 
        let url = 'http://api.grcfincrimetoday.org/api/pinncomment';
          fetch(url, requestOptions)
          .then(response => response.json())
          .then(result =>{
          //   console.log(result)
               if(result.success){
                SetcurrentNum(null) 
  
               }else{
  
               }
          })
       })
}

const handleunpin =(id)=>{
let myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer "+local.token);
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  'comment_id':id,
  'articles_id':artcleid
});

var requestOptions = {
    method:'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  apiClient.get('/sanctum/csrf-cookie').then( ()=> { 
    let url = 'http://api.grcfincrimetoday.org/api/unpinncomment';
      fetch(url, requestOptions)
      .then(response => response.json())
      .then(result =>{
      //   console.log(result)
           if(result.success){
            SetcurrentNum(null) 

           }else{

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
                        <li><a >Home</a></li>
                         <li><a >{findno?findno.categories:""}</a></li>
                         <li className="active"><Markup content={findno?findno.articlename:""} /></li> 
                    </ol>
                </div>
            </div>
            <div className="col-lg-12 col-sm-12 col-md-12 col-xs-12">
                <div className="page-section">
                    <h1 className="page-title">Post Single Page</h1></div>
            </div>
        </div>
    </div>
    
    
    <div className="content">
        <div className="container">
            <div className="row">
                <div className="col-lg-8 col-md-8 col-sm-8 col-xs-12">
                    <div className="row">
                        <div className="col-lg-12 col-sm-12 col-md-12 col-xs-12">
                            <h1><Markup content={findno?findno.articlename:"" } /></h1>
                            <p className="meta"><span className="meta-category"><a  className="meta-link">Year</a></span> 
                            <span className="meta-date">{ findno?findno.yearup:"" }</span>
                            <span className="meta-comments">(23) <a  className="meta-link">Comments</a></span>
                            </p>
                            <div className="post-img"> <img src={ findno?findno.picture:"" } alt=""/></div>
                            <div className="row">
                              
                                <div className="col-lg-10 col-md-10 col-sm-10 col-xs-10">
                                    <div className="post-content">
                                        {/* 
                                        
                                         findno.articlebodyone findno.articlebodytwo findno.articlebodythree findno.articlebodyfour findno.articlebodyfive findno.articlecoatbody 

                                        */}
    
                                         {/* first artcle  */}
    
                                           <p className="firstartcle">
                                            <Markup content={findno?findno.articlebodyone:''} />
                                           </p>
                                          {/* first artcle   */}
    
                                              {/* second artcle   */}
                                        <p className="secondartcle">
                                        <Markup content={findno?findno.articlebodytwo:''} />
 
                                        </p>
                                         {/* second artcle */}
    
                                          {/* artcle cout mark   */}
                                        <blockquote className="artclecoutmark"> <Markup content={findno?findno.articlecoatbody:''} /> </blockquote>
                                          {/* artcle cout mark */}
    
                                          {/* thrid artcle  */}
                                        <p className="thridartcle">
                                        <Markup content={findno?findno.articlebodythree:''} />
 
                                        </p>
                                        {/* thrid artcle  */}
    
                                           {/* fouth arcle  */}
                                         <p className="foutharcle">
                                         <Markup content={findno?findno.articlebodyfour:''} />

                                         </p>
                                             {/* fouth arcle  */}
    
                                          {/* fivtharcle */}
                                        <p className="fivtharcle">
                                        <Markup content={findno?findno.articlebodyfive:''} />
 
                                        </p>
                                          {/* fivth arcle  */}
    
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12 col-sm-12 col-md-12 col-xs-12">
    
                        </div>
                        <div className="col-lg-12 col-sm-12 col-md-12 col-xs-12">
                            <div className="related-post-block">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="section-header">
                                            <h2 className="heading-line">Related Posts</h2></div>
                                    </div>
                                </div>
                                <div className="row">
                                    {
                                    realted.length > 0?
                                    realted.map((item)=>{
                                        return    <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                        <div className="related-post">
                                            <a ><img src={item.picture} alt=""/></a>
                                            <div className="related-post-content">
                                                <h3><a onClick={()=>handleRead(item.id)} className="post-title">< Markup content={item.articlename } /></a></h3>
                                                <p className="meta">in <span className=" meta-category"><a className="meta-link">{ item.categories }</a></span></p>
                                            </div>
                                        </div>
                                    </div>
                                    })
                                    :""
                                    
                                  }
    
    
    
                                </div>
                            </div>
                        </div>
                     
                        <div className="w-full sm:w-full md:w-full lg:w-full ">
                            <div className="comments-area mb40 overflow-y-scroll">
                                <h1 className="comments-title heading-line amountcomment"></h1>
    
                                <ul className="grid grid-cols-1 gap-2 ">
                           
                                   {
                                   comment.length > 0?
                                   comment.map((one, index)=>{
                                    //   console.log(item)
                                    let bool = new Date(one.created_at)
                                    var dd = String(bool.getDate()).padStart(2, '0');
                                    var mm = String(bool.getMonth() + 1).padStart(2, '0');
                                    var yyyy = bool.getFullYear();
                                    let createddate = dd+ '/' + mm + '/' + yyyy
                                    return <li class= {one.pinned?"flex flex-col items-col px-2 py-2 bg-[#ff8b3d] bg-opacity-10": "flex flex-col items-col px-2 py-2"}  >
                                    <div class="comment-body">
                                        <div class="">
                                            <div class="comment-author"> 
                                            <img className='rounded-full'  src= {one.picture?one.picture:"https://res.cloudinary.com/the-morgans-consortium/image/upload/v1655623286/assets/images/avatars/placeholder_afekpj.png"}  />
                                            </div>
                                            <div class="comment-info">
                                                <div class="comment-header">
                                                   <span className='flex flex-row items-center justify-between border-3 relative'>
                                                    <h4 class="user-title" >{one.name}</h4>  
                                                    <span className='text-black block text-lg cursor-pointer' onClick={()=>handleSoon(index)}>...</span>

                                                    <div className={index === currentNum?'w-1/3 sm:w-1/3 md:w-1/3 lg:w-1/6 bg-white rounded-md top-6 absolute right-0 py-2 shadow-md':'hidden' }  >
                                                        <ul className='w-full'>
                                                            <li className='text-center cursor-pointer hover:bg-blacke hover:bg-opacity-10 hover:text-[#FF6600]' onClick={()=>handleRex(one.id)}>reply</li>
                                                            {local.usertype === 'User'?
                                                           <li className='text-center cursor-pointer hover:bg-blacke hover:bg-opacity-10 hover:text-[#FF6600]' onClick={()=>handlereport(one.id)}>report</li>
                                                            :""}
                                                            {local.usertype === "Admin"? 
                                                            <li className='text-center cursor-pointer hover:bg-blacke hover:bg-opacity-10 hover:text-[#FF6600]' onClick={()=>handledel(one.id)}>delete</li>
                                                           :""} 
                                                       
                                                       {local.usertype === "Admin"? 
                                                       one.pinned?
                                                       <li className='text-center cursor-pointer hover:bg-blacke hover:bg-opacity-10 hover:text-[#FF6600]' onClick={()=>handleunpin(one.id)}>unpin</li>   :
                                                        <li className='text-center cursor-pointer hover:bg-blacke hover:bg-opacity-10 hover:text-[#FF6600]' onClick={()=>handlepin(one.id)}>pin</li>
                                                        
                                                           :""} 

                                                        </ul>
                                                    </div>
                                                    </span> 
                                                    <div class="flex flex-row items-center justify-between"><span class="comment-meta-date">{createddate}</span>
                                                    { one.pinned?
                                                       <span>
                                                       <AiFillPushpin className=' block text-lg sm:text-lg  md:text-2xl  lg:text-2xl cursor-pointer'/>
                                                     </span>
                                                    :""}
                                                 
                                                    </div>
                                                  
                                                </div>
                                                <div class="comment-content">
                                                    <p>{one.message}</p>
                                                </div>
                                                {one.reply.length > 0?
                                                 <span className="w-full float-left" onClick={()=>handleSee(one.id)}>
                                                 <h3 className='text-black text-left text-xs cursor-pointer'  >Reply({one.reply.length})</h3>
                                                 </span>
                                                :""}

                                        <section className={showid === one.id?"w-full ":"hidden"}  >
                                            <ul className='w-full grid gap-2'>
                                             {one.reply.map((item, index)=>{
                                             
                                                let bool = new Date(item.created_at)
                                                var dd = String(bool.getDate()).padStart(2, '0');
                                                var mm = String(bool.getMonth() + 1).padStart(2, '0');
                                                var yyyy = bool.getFullYear();
                                                let createddate = dd+ '/' + mm + '/' + yyyy
                                                return  <li className="w-full flex flex-row items-center space-x-2" key={index}>
                                                <span className="w-1/3 sm:w-1/3 md:w-1/3 lg:w-1/12 grid place-content-center">
                                               <img className='rounded-full'  src={item.picture?item.picture:"https://res.cloudinary.com/the-morgans-consortium/image/upload/v1655623286/assets/images/avatars/placeholder_afekpj.png"}  />
                                               </span>
                                               <span className="w-2/3 sm:w-2/3 md:w-1/2 lg:w-1/2 flex flex-col items-center">
                                                <span className='text-left w-full'>{item.name}</span>
                                                <span className='text-left w-full'>{createddate}</span>
                                                <span className='text-left w-full'>{item.message}</span>
                                               </span>
                                                </li>
                                             })}
                                           

                                            </ul>
                                           
                                        </section>
                                               
                                            </div>
                                           
                                        </div>
                                       
                                    </div>
                                  
                                </li>
                                   })
                                   :""
                                   
                                 
                                }
    
    
                                </ul>
    
    
    
                            </div>
                        </div>
                           {/* col-lg-12 col-sm-12 col-md-12 col-xs-12 */}
                        <div className="w-full sm:w-full md:w-full lg:w-full ">
                            <div className="leave-reply">
                                <div className="row">
                                    <div className="col-lg-12 col-sm-12 col-md-12 col-xs-12">
                                        <div className="section-header">
                                            <h2 className="heading-line mb20">Leave A Comments</h2>
                                            <p>Your email address will not be published. Required fields are marked *</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">


                                     <div className="col-lg-12 col-sm-12 col-md-12 col-xs-12">
                                        <form className="reply-form">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <label className="control-label" >Message</label>
                                                    <textarea className="form-control message"value={message} onChange={(e)=>Setmessage(e.target.value)} id="textarea" name="textarea" rows="6" placeholder="Message"></textarea>
                                                </div>
                                                <div className="col-md-8">
                                                    <div className="form-group">
                                                        <label className="control-label" >Name<span>*</span></label>
                                                        <input id="name" value={name} onChange={(e)=>Setname(e.target.value)} name="name" type="text"  placeholder="Name" className="form-control  input-md name" required/>
                                                    </div>
                                                </div>
                                                <div className="col-md-8">
                                                    <div className="form-group">
                                                        <label className="control-label" >E-mail<span>*</span></label>
                                                        <input id="email" value={email} onChange={(e)=>Setemail(e.target.value)} name="email" type="text" placeholder="E-mail" className="form-control input-md email" required/>
                                                    </div>
                                                </div>
                                        
                                                <div className="col-md-12">
                                                    <div className="form-group">
                                                        {comment_id !== ""?
                                     <button id="singlebutton" onClick={(e)=>handleReply(e)}  name="singlebutton" className="btn btn-default singlebtn">Reply</button>
     
                                                        :
                                     <button id="singlebutton" onClick={(e)=>handleClicks(e)}  name="singlebutton" className="btn btn-default singlebtn">Submit</button>

                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
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
                                <ul className="firstmain">
                                         {
                                         categoriesdata.length > 0?
                                         categoriesdata.map((item)=>{
                                            if(item.categories != 'Introduction'){
                                                return <li><a>{item.categories}</a><span class="badge">{item.number}</span></li>

                                            }
                                         })
                                         :""
                                         /* <li><a href="#">${item.categories}</a><span class="badge">${item.number}</span></li> */
                                         }
                                </ul>
                            </div>
                        </div>
                
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div className="widget widget-social">
                                <h2 className="widget-title">Share with us</h2>
                                <ul> 
                                             <li><a className='flex flex-row items-center space-x-3'> <BsFacebook className='text-lg text-black' /> Facebook  </a></li>
                                             <li><a  className='flex flex-row items-center space-x-3'><BsTwitter className='text-lg text-black' />Twitter  <i className="fa-brands fa-twitter pull-right widget-social-icon"></i></a></li>
                                             <li><a className='flex flex-row items-center space-x-3'><BsInstagram className='text-lg text-black' /> Instagram <i className="fa-brands fa-instagram pull-right widget-social-icon"></i></a></li>
                                             <li><a className='flex flex-row items-center space-x-3'>< BsLinkedin className='text-lg text-black'/> Linkedin<i className="fa-brands  fa-linkedin pull-right widget-social-icon"></i></a></li>
         
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
                                    <h4><a  onClick={()=>handleRead(item.id)} className="post-title">< Markup content={item.articlename} /></a></h4>
                                    <p className="meta"><span className="meta-category"><a  onClick={()=>handleRead(item.id)} className="meta-link">{ item.categories }</a></span> <span className="meta-date">{ item.yearup }</span>
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

{/* {reportid !== ''?"bg-cover top-0 left-0 right-0 bottom-0 bg-black bg-opacity-10 text-blue-500 fixed z-10 flex flex-row items-center  justify-center  overflow-y-scroll py-4":'hidden z-0'} */}
    <article className={reportid !== ''?"bg-cover top-0 left-0 right-0 bottom-0 bg-black bg-opacity-10  fixed z-10 flex flex-row items-center  justify-center  overflow-y-scroll py-4":'hidden z-0'}  >
           
           <div className="w-10/12 sm:w-10/12 md:w-1/3  lg:w-1/3 flex flex-col items-center m-auto bg-white rounded-md py-3 px-2">
            <article className="w-full">
                <span className=" w-1/12 float-right flex flex-row items-center">
                   <div  onClick={()=>Setreportid('')} className="w-6 h-6 rounded-full text-center grid place-content-center text-lg text-white bg-[#FF6600]">
                    x
                   </div>
                </span>
            </article>
                <section className='w-full flex flex-col items-center '>
                    <section className='w-full text-left'>
                        Message
                    </section>
                    <section className="w-full mt-2">
                      <textarea value={reportmessage} onChange={(e)=>Setreportmessage(e.target.value)}  className='w-full h-28 sm:h-32 md:h-52 lg:h-52 border outline-0 p-3'></textarea>
                    </section>
                    <section className='w-full'>
                        <div className='w-1/5 float-right'>
                          <button className='w-11/12 rounded-md bg-[#FF6600] text-white text-center py-2' onClick={()=>handleSubmitReport()}>
                            submit
                          </button>
                        </div>
                    </section>
                </section> 


           </div>

    </article>
        </section>
    
    )
}
