import React,{useState, useEffect, useRef, useContext} from 'react';
import '../css/chat.css';
import '../css/chats.css';
import { GiHamburgerMenu } from 'react-icons/gi';
import axios from 'axios';
import { AES, enc } from 'crypto-js';
import Pusher from 'pusher-js';
import Echo from 'laravel-echo';
import { Link } from 'react-router-dom';
import { context } from '../component/Context';
import { useNavigate } from 'react-router-dom';
let local = localStorage.getItem('userlogindetails')?JSON.parse(AES.decrypt(localStorage.getItem('userlogindetails'), 'GRCMAZAGINE').toString(enc.Utf8)):{}
export default function Chat() {
const [userdata, Setuserdata] = useState(local?local:{});
const [show, Setshow] = useState(false);
const [data, Setdata] = useState([]);
const [otheruser, Setotheruser] = useState(null);
const [message, Setmessage] = useState('')
const [cindex, Setcindex] = useState(null)
const [chatmessage, Setchatmessage] = useState([]);
const [channelpart, Setchannelpart] = useState('');
const [allmessage, Setallmessage] = useState([]);
const [currentusertyping, Setcurrentusertyping] = useState(null);
const [search, Setsearch] = useState('')
// const [onlineuser, Setonlineuser] = useState([])
const [profile, Setprofile] = useState({})
const downscroll = useRef();
const navigate = useNavigate();
const content = useContext(context)
let onlineuser = content.onlineuser
let Setonlineuser = content.Setonlineuser
let urlre = window.location.origin;
const apiClient = axios.create({
    baseURL: "http://127.0.0.1:8000",
    withCredentials: true
  });
 const handleShow = ()=>{
if(show === false){
    Setshow(true) 
}else{
    Setshow(false)   
}
 }


  


// console.log(userdata)

 useEffect(()=>{
   
    if(Object.keys(local).length === 0){
        console.log('nothing')
      }else{
          if(local.usertype === "Admin" || local.usertype === "User" ){
            // console.log(userdata)
         }else{
          localStorage.clear();
        //   window.location.href='/'
          navigate(`/`)

          
         }
      } 



    apiClient.get('/sanctum/csrf-cookie').then( ()=> {
        let url = '/api/reportdetail';
        apiClient.get(url, {
          headers:{
            "Authorization":"Bearer "+userdata.token,
            }
        }).then(res=>{
            // console.log(res)
            // Setdata(res.data.success)

        })
  })


  apiClient.get('/sanctum/csrf-cookie').then( ()=> {
    let url = '/api/chatmessage';
    apiClient.get(url, {
      headers:{
        "Authorization":"Bearer "+userdata.token,
        }
    }).then(res=>{
        //  console.log(res)
        Setdata(res.data.success)

    })
})


// allmessages

apiClient.get('/sanctum/csrf-cookie').then( ()=> {


    let url = '/api/allmessages';
    apiClient.get(url, {
      headers:{
        "Authorization":"Bearer "+userdata.token,
        }
    }).then(res=>{
     
         Setallmessage(res.data.success)
    })
})




},[])


useEffect(()=>{

    // Pusher.logToConsole = true;
    // var pusher = new Pusher('1bb26742949be48f563e', {
    //   cluster: 'eu',
    //   forceTLS: true,
    //   authEndpoint : 'http://127.0.0.1:8000/broadcasting/auth',
    //  auth:{
    //      headers:{
    //          Authorization: "Bearer " +userdata.token,
    //          Accept: "application/json",
    //      }
    //  }
    // });

    // var channel = pusher.subscribe('message.'+userdata.id);
    // channel.bind('messages', function({data}) {
    //   console.log(data)
    // });
   
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
        var channel = window.Echo.private(`message.${userdata.id}`);
        channel.listen('.messages',function(data) {
        //    console.log(data)
           Setchatmessage(data.data)
           Setallmessage(data.data)
        })

        var type = window.Echo.private(`typing.${userdata.id}`);
        type.listen('.type',function(data) {
            // console.log(data)
           Setcurrentusertyping(data.data)
        })


        apiClient.get('/sanctum/csrf-cookie').then( ()=> {
            let url = '/api/getprofile/'+userdata.email;
            apiClient.get(url, {
              headers:{
                "Authorization":"Bearer "+userdata.token,
                }
            }).then(res=>{
                if(res.data.success){
                  Setprofile(res.data.success) 
                }
              
            }).catch(err=>{})
          })


    window.Echo.join('chat')
    .here((user)=>{
        console.log(user)
        Setonlineuser(user)
            // axios.put('/api/user/'+user[0].id+'/online?api_token='+user[0].api_token, {});  
    }).joining((we) => {
        console.log(we)
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
        console.log(e)
        // this.friend = e.user;
    });
    
},[])

const handleUion =(e, id, index)=>{
    e.preventDefault();
    Setotheruser(id)
    Setcindex(index)


    apiClient.get('/sanctum/csrf-cookie').then( ()=> {


        let url = '/api/particularuser/'+id;
        apiClient.get(url, {
          headers:{
            "Authorization":"Bearer "+userdata.token,
            }
        }).then(res=>{
            // console.log(res)
            if(res.data.success){
                Setchatmessage(res.data.success);
                Setshow(false)    
            }
            // Setallmessage(res.data.success)
        })
    })
}

const handleClick =()=>{
    if(message !== "" && otheruser !== 0){

        let formData = new FormData();
        formData.append('send_id', userdata.id)
        formData.append('rec_id',  otheruser)
        formData.append('message',  message)
        let urltwo = '/api/sendmessage';
        apiClient.get('/sanctum/csrf-cookie').then(()=>{
          apiClient.post(urltwo, formData, {
            headers:{
                "Authorization":"Bearer "+userdata.token,
                }
          }).then(res=>{
            // console.log(res)
                if(res.data.success){
                    Setchatmessage(res.data.success)
                    Setallmessage(res.data.success)
                    Setmessage("")
                }
       
               }).catch(err=>{
                 let error = err.response.data.errors
                //  if(error.email){
                //   Setmessage(error.email[0])                          
                //  }else if(error.password){
                //    Setmessage(error.password[0])
                //  }else if(error.name){
                //    Setmessage(error.name[0])
     
                //  }
             })
    
    
        })


    }else{
        Setcurrentusertyping('') 
    }
  
}

const handleChat =(e)=>{
    e.preventDefault();
    Setmessage(e.target.value)
    let word = e.target.value;
 
    if(otheruser != "" && word.length > 1){
        setTimeout(()=>{
            apiClient.get('/sanctum/csrf-cookie').then( ()=> {
                let url = '/api/typing/'+otheruser;
                apiClient.get(url, {
                  headers:{
                    "Authorization":"Bearer "+userdata.token,
                    }
                }).then(res=>{
                    // console.log(res)
                   
                    // Setallmessage(res.data.success)
                })
            })

        }, 3500)
       

    }
}
useEffect(()=>{
    if(currentusertyping != null){
        console.log('empty me ')
       setTimeout(()=>{
           Setcurrentusertyping('')
    
       },6500)
    }
  
},[currentusertyping])

useEffect(()=>{
    downscroll.current?.scrollIntoView({ behavior: 'smooth' })
},[chatmessage])

const handleSearch = (e)=>{
e.preventDefault();
Setsearch(e.target.value);
let word = e.target.value;
if(word.length > 1){
    setTimeout(()=>{
        apiClient.get('/sanctum/csrf-cookie').then( ()=> {
            let url = '/api/searchuser/'+search;
            apiClient.get(url, {
              headers:{
                "Authorization":"Bearer "+userdata.token,
                }
            }).then(res=>{
                if(res.data.success){
                    Setdata(res.data.success)
                }
            })
        })

    }, 3500)
}else{

    apiClient.get('/sanctum/csrf-cookie').then( ()=> {
        let url = '/api/chatmessage';
        apiClient.get(url, {
          headers:{
            "Authorization":"Bearer "+userdata.token,
            }
        }).then(res=>{
            console.log(res)
            Setdata(res.data.success)
        })
  })

}


}


const handleLogOut = ()=>{
    let urltwo = `/api/logout`;
    apiClient.get('/sanctum/csrf-cookie',{
    }).then( ()=> {
        apiClient.get(urltwo, {
            headers:{
                "Authorization":"Bearer "+userdata.token,
                }
        }).then(res=>{
        console.log(res)
    if(res.data.success){
    localStorage.clear();
    // window.location.href='/'
    navigate('/')
     }
    
      })
    })
    
      
      }



  return (
    <div id="app bg-white">
    <nav className="navbar navbar-expand-md navbar-light bg-white shadow-sm">
        <div className="container">
      <button className='rounded-md border-2 px-1 py-1 block sm:block md:hidden lg:hidden' onClick={handleShow} >
      <GiHamburgerMenu className="text-2xl"  onClick={handleShow}/>
      </button>
             <div className='hidden sm:hidden md:w-1/3 md:float-left md:flex md:flex-row md:items-center md:space-x-2  lg:w-1/3 lg:float-left lg:flex lg:flex-row bg-white lg:items-center lg:space-x-2'>
                <article className='w-10 h-10 rounded-full'>
                    <img src={profile?profile.picture:"https://res.cloudinary.com/the-morgans-consortium/image/upload/v1658329437/Tmc%20institute/blank-profile-picture-gae268b379_1280_gtgqxr.png"} className="w-full h-full object-cover rounded-full"/>
                </article>

                <section className=' flex flex-col items-center'>
                    <span className='w-full text-black text-left'>{userdata?userdata.name:""}</span>
                  <span  className='w-full text-black text-left'>{userdata?userdata.email:""}</span>
                </section>

             </div>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">

                </ul>

                <ul className="navbar-nav ml-auto">
         
                            <li className="nav-item">
                                <a className="nav-link" >Login</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link">Register</a>
                            </li>
                
                        <li className="nav-item dropdown">
                            <a id="navbarDropdown" className="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-pre>
                                name
                            </a>

                            <div className="dropdown-menu dropdown-menu-right" onClick={handleLogOut}>
                             <a className=' cursor-pointer' onClick={handleLogOut}>Logout</a>
                            </div>
                        </li>
                </ul>
            </div>
        </div>
    </nav>


    <section className="w-full mt-1 border border-black flex flex-row items-center bg-white">
        <div className={show?"absolute z-20 w-full  bg-white translate-x-0 h-full h-39  ease-in duration-300  sm:mt-0  sm:h-[39rem] sm:absolute sm:bg-white sm:z-20 sm:w-full sm:translate-x-0 sm:ease-in sm:duration-300    md:relative md:mt-0 md:w-2/6 md:z-auto md:translate-x-0   lg:relative lg:w-2/6 lg:mt-0 lg:translate-x-0 lg:z-auto ":"absolute z-20 w-full bg-white -translate-x-full ease-in duration-300 h-39  sm:h-[39rem] sm:absolute sm:bg-white sm:z-20 sm:w-full sm:-translate-x-full sm:ease-in sm:duration-300    md:relative md:w-2/6 md:mt-0 md:z-auto md:translate-x-0   lg:relative lg:w-2/6 lg:mt-0 lg:translate-x-0 lg:z-auto "}   >
        <article className="w-full sm:w-full md:w-full lg:w-full flex flex-col ">
          <div className="w-full bg-white">
            <input type="text" className="w-3/4 rounded border border-black m-auto p-2 bg-white" value={search} onChange={(e)=>handleSearch(e)} placeholder="search for users ..." />
          </div>
           <section className="w-full flex flex-col  border border-blue-500 ">
            <ul className="users overflow-y-scroll">
                {data.map((items, index)=>{
                   let ansdata = onlineuser.map((item)=>item.id == items.id)
                   let answer = ansdata.includes(true);
                    if(items.id != userdata.id){
                        return <li className={index == cindex?"user bg-[#eeeeee]":"user" }  onClick={(e)=>handleUion(e, items.id, index)} key={items.id}>
                         {answer == true ? 
                              <span className="pendingx text-center grid place-content-center ">
                              {allmessage.filter((item)=>item.status === 0 && item.send_id == items.id  && item.rec_id == userdata.id ).length}
                          </span>
                         :
                         <span className="pending text-center grid place-content-center">
                         {allmessage.filter((item)=>item.status === 0 && item.send_id == items.id  && item.rec_id == userdata.id ).length}
                     </span>
                         }
                        
    
                    <div className="media">
                        <div className="media-left">
                            <img src={items.picture?items.picture:"https://res.cloudinary.com/the-morgans-consortium/image/upload/v1658329437/Tmc%20institute/blank-profile-picture-gae268b379_1280_gtgqxr.png"} alt="empty" className="media-object"/>
                        </div>
    
                        <div className="media-body">
                            <p className="name text-black">{items.name}</p>
                            <p className="email text-black">{items.email}</p>
                            {/* 'email text-[#FF6600] text-xs' */}
                            <p className={currentusertyping?currentusertyping.id == items.id?'email text-[#FF6600] text-xs' : 'hidden' :'hidden'} >{currentusertyping?currentusertyping.name+" is typing":""}</p>
                        
                        </div>
                    </div>
                </li>
                    }
             
                })}
              


           
        </ul>
        <ul className=" w-full flex flex-col items-center">
        <li className="w-full h-10 py-2  text-lg text-center   flex flex-row items-center justify-center hover:bg-[#eeeeee] text-black cursor-pointer"><Link to="/">Go Back Home</Link> </li>
        <li className="w-full h-10 py-2  text-lg text-center   flex flex-row items-center justify-center hover:bg-[#eeeeee] text-black cursor-pointer">Logout</li>
          </ul>
           </section>
         

        </article>
       
        </div>
        <article className="w-full h-full bg-white sm:w-full sm:h-full sm:bg-white md:w-4/6 md:h-full md:bg-white lg:w-4/6 lg:h-full lg:z-auto lg:bg-white">
            <div className="w-full overflow-x-scroll bg-white sm:w-full sm:overflow-x-scroll sm:bg-white  md:w-full md:bg-white md:overflow-x-scroll lg:w-full lg:bg-white lg:h-full lg:overflow-x-scroll">
                <div className="message-wrapper ">
                    <ul className="messages">
                        {chatmessage.length > 0?  chatmessage.map((item)=>{
                           if(item.send_id == userdata.id && item.rec_id ==  otheruser ){
                            return <li className="message clearfix" key={item.id}>
                            <div className={userdata.id === item.send_id?"w-3/4 float-right text-right rounded bg-white py-1 px-2 text-[#FF6600] sm:w-3/4  sm:float-right sm:text-right sm:rounded sm:bg-white sm:py-1 sm:px-2 sm:text-[#FF6600]  md:sent md:text-[#FF6600] lg:px-2 lg:sent lg:text-[#FF6600]":"w-3/4 float-left text-right rounded bg-white py-1 px-2 text-blue-400 sm:w-3/4  sm:float-left sm:text-right sm:rounded sm:bg-white sm:py-1 sm:px-2 sm:text-blue-400  md:sent md:bg-white md:text-blue-400 lg:sent lg:text-blue-400 lg:bg-white"}   >
                                <p>{item.sender.name}</p>
                                <p>{item.message}</p>
                                <p className="date">{item.created_at}</p>
                            </div>
                        </li>
                           }else if(item.send_id == otheruser && item.rec_id ==  userdata.id){

                                    return <li className="message clearfix" key={item.id}>
                                    <div className={userdata.id === item.send_id?"w-3/4 float-right text-right rounded bg-white py-1 px-2 text sm:w-3/4  sm:float-right sm:text-right sm:rounded sm:bg-white sm:py-1 sm:px-2 sm:text-white  md:sent lg:sent":"w-3/4 float-left text-right rounded bg-white py-1 px-2 text-blue-400 sm:w-3/4  sm:float-left sm:text-right sm:rounded sm:bg-white sm:py-1 sm:px-2 sm:text-blue-400  md:sent md:bg-white md:text-blue-400 lg:sent lg:text-blue-400 lg:bg-white"}   >
                                        <p>{item.sender.name}</p>
                                        <p>{item.message}</p>
                                        <p className="date">{item.created_at}</p>
                                    </div>
                                </li>

                           }
                        }):<li className='text-center flex flex-col items-center justify-center font-extrabold text-[#FF6600]'>
                                <p>Please Click on the Individual you want to chat with Thank you</p>  
                                <div className='m-auto'>
                                    <img src='https://res.cloudinary.com/the-morgans-consortium/image/upload/v1679299410/Grc%20magazine/GRC_Fincrime_mrzg31.png' className='  w-72  h-32'/>
                                     </div>
                            </li>}
                        
                     <li className="message clearfix" ref={downscroll} >
                    <div  className={currentusertyping?"float-right text-right rounded  py-1 px-2 text-[#FF6600]  sm:w-3/4  sm:float-right sm:text-right sm:rounded sm:py-1 sm:px-2 sm:text-[#FF6600] text-[#FF6600] ":"hidden"}>
                    {currentusertyping?currentusertyping.name+" is typing":""}
                    </div>
                     </li>

                        
                       
                            
                    </ul>
                </div>

                <section className="w-full flex flex-row items-center  px-4  space-x-4 sm:w-full sm:flex sm:flex-row sm:px-4 sm:h-full sm:space-x-2 md:w-full md:flex md:flex-row md:items-center md:h-full md:justify-center md:space-x-2   lg:w-full lg:flex lg:flex-row lg:items-center lg:justify-center lg:h-auto  lg:bg-white lg:space-x-2">
                <span className="w-3/4 sm:w-3/4 md:w-10/12 lg:w-10/12">
                <input type="text" className=" w-full p-3" value={message} onChange={(e)=>handleChat(e)} />
                </span>
                <span className="w-1/12 flex flex-row items-center justify-center">
                <button className=" w-18 ml-3 sm:w-32 md:w-20 lg:w-full text-lg text-center rounded bg-blue-500 text-white  h-10 px-2" onClick={handleClick}>
                    submit
                </button>
               </span>
              </section>
              
            </div>
            

        </article>

       
      
    </section>

</div>

  )
}
