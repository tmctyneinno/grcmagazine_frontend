import React,{useEffect, useState} from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AES, enc } from 'crypto-js';
import { useNavigate } from 'react-router-dom';
let local = localStorage.getItem('userlogindetails')?JSON.parse(AES.decrypt(localStorage.getItem('userlogindetails'), 'GRCMAZAGINE').toString(enc.Utf8)):{}
export default function Navbar() {
    const [userdata, Setuserdata] = useState(local?local:{})

    // let userlogindetails = !!localStorage.getItem('userlogindetails')
    // useEffect(()=>{
    //     if(userlogindetails){
    //       let ans = localStorage.getItem('userlogindetails')
    //       let show = AES.decrypt(ans, 'GRCMAZAGINE').toString(enc.Utf8);
    //       let ring = JSON.parse(show)
    //       // console.log(ring.data)
    //       // ring.data.email
    //       // ring.data.id
    //       Setuserdata(ring.data)
    //     }
    // },[])
    // const navigate = useNavigate();
    let original = window.location.origin;
    const apiClient = axios.create({
        baseURL: "http://api.tmcinstitute.com",
        withCredentials: true
      });

    const handleLogOut = ()=>{
      
       
  let myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer "+userdata.token);
  myHeaders.append("Content-Type", "application/json");
  var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  redirect: 'follow'
  };
  
  const url = 'http://api.tmcinstitute.com/api/logout';
  apiClient.get('/sanctum/csrf-cookie').then( ()=> { 
  fetch(url, requestOptions)
  .then(response => response.json())
  .then(result =>{
    console.log(result)
      if(result.success){
  
        localStorage.clear();
          window.location.href=`${original}`
        //   navigate('/')
      }
  })
  .catch(error => console.log(error));
     })


  
  }




   function Linkss(){
    if(Object.keys(userdata).length === 0){
        return  <ul>
            <li className='cursor-pointer'><a><Link to="/">Home</Link>   </a>
            </li>
            <li className='cursor-pointer'><a> <Link to="/lists">Stories</Link>  </a>
            </li >
            <li className='cursor-pointer'><a ><Link to="/user/register">Register</Link> </a></li>
            <li><a className='cursor-pointer' > <Link to="/Advert">Advert</Link></a></li>
            <li className='cursor-pointer'><a > <Link to="/contact">Contact us</Link>  </a></li>
            {/* <li><a onClick={handleLogOut}> Logout  </a></li> */}
            </ul>

      }else{
          if( userdata.usertype === "User" ){
  return  <ul>
  <li className='cursor-pointer'><a><Link to="/">Home</Link>   </a>
  </li>
  <li className='cursor-pointer'><a> <Link to="/lists">Stories</Link>  </a>
  </li>
  <li className='cursor-pointer'><a > <Link to="/contact">contact us</Link>  </a></li>
 <li className='cursor-pointer'><a><Link to="/chat">Chat</Link></a></li>
  <li className='cursor-pointer'><a><Link to="/user/profile">Profile</Link></a></li>
  <li><a className='cursor-pointer' > <Link to="/Advert">Advert</Link></a></li>
  <li className='cursor-pointer'><a onClick={handleLogOut}> Logout  </a></li>
      </ul>

         }else if(userdata.usertype === "Admin" ){
            // /admin/report
            return  <ul>
            <li className='cursor-pointer'><a><Link to="/">Home</Link>   </a>
            </li>
            <li className='cursor-pointer'><a> <Link to="/createstories">Create Story</Link>  </a>
            </li>
            <li className='cursor-pointer'><a > <Link to="/admin/list">AdminList</Link>  </a></li>
           <li className='cursor-pointer'><a><Link to="/chat">Chat</Link></a></li>
            <li className='cursor-pointer'><a><Link to="/admin/createSubscribe">Admin Subscription</Link></a></li>
            <li><a className='cursor-pointer' > <Link to="/admin/viewcomment">viewComment</Link></a></li>

            <li><a className='cursor-pointer' > <Link to="/admin/Advert">AdminAdvert</Link></a></li>

            <li><a className='cursor-pointer' > <Link to="/admin/report">report</Link></a></li>
            <li className='cursor-pointer'><a onClick={handleLogOut}> Logout  </a></li>
                </ul>

         }
         
         else{
            return  <ul>
            <li><a><Link to="/">Home</Link>   </a>
            </li>
            <li className='cursor-pointer'><a> <Link to="/lists">Stories</Link>  </a></li>
            <li className='cursor-pointer'><a ><Link to="/user/register">Register</Link> </a></li>
            <li><a className='cursor-pointer' > <Link to="/Advert">Advert</Link></a></li>
            <li className='cursor-pointer'><a > <Link to="/contact">Contact us</Link>  </a></li>

                </ul>
          
         }
      } 
   }

    
    return (
        <div className="header">

<div className="container m-auto grid place-content-center">
            <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div className="header-logo text-center w-3/4 sm:w-2/3 md:w-1/5 lg:w-1/5 m-auto ">
                    <Link to="/"><a  title="GRC MAGAZINE"><img src="https://res.cloudinary.com/the-morgans-consortium/image/upload/v1679299410/Grc%20magazine/GRC_Fincrime_mrzg31.png"  /></a></Link>
                    </div>
                </div>
            </div>
        </div>

        <div className="navigation">
        <div className="container">
            <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div id='navigation'>
                      <Linkss />
                        {/* <ul>
                            <li><a><Link to="/">Home</Link>   </a>
                            </li>
                            <li className='active'><a> <Link to="/lists">Stories</Link>  </a>
                            </li>
                            <li><a > <Link to="/contact">contact us</Link>  </a></li>
                            <li><a><Link to="/user/profile">Profile</Link></a>
                            </li>
                            <li><a onClick={handleLogOut}> Logout  </a></li>

                                </ul> */}
                        </div>
                    </div>
                </div>
            </div>
         </div>
         </div>
    )
}
