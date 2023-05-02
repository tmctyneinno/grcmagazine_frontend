import React,{useState, useEffect} from 'react'
import '../css/custom.css';
import imgone from '../img/candidate-profile.png';
import Navbar from '../component/Navbar';
import axios from 'axios';
import { AES, enc } from 'crypto-js';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
let local = localStorage.getItem('userlogindetails')?JSON.parse(AES.decrypt(localStorage.getItem('userlogindetails'), 'GRCMAZAGINE').toString(enc.Utf8)):{}
export default function Profile() {
  let url = window.location.origin

   const [name, Setname] = useState(local?local.name:'')
   const [email, Setemail] = useState(local?local.email:'')   
   const [sent, Setsent] = useState(false)
   const [phone, Setphone] = useState('')
   const [state, Setstate] = useState('')
   const [country, Setcountry] = useState('')
   const [city, Setcity] = useState('')
   const [zipcode, Setzipcode] = useState('')
   const [userdata, Setuserdata] = useState(local?local:{})
   const [password, Setpassword] = useState('')
   const [password_confirmation, Setpassword_confirmation] = useState('')
   const [message, Setmessage] = useState('')
   const [messagetwo, Setmessagetwo] = useState('')
   const [messagethree, Setmessagethree] = useState('')
   const [image, Setimage] = useState([]);
   const [showx, Setshowx] = useState(false)
   const [profile, Setprofile] = useState({})
   const [subdata, Setsubdata] = useState({})
  const apiClient = axios.create({
    baseURL: "http://127.0.0.1:8000",
    withCredentials: true
  });
  const navigate = useNavigate();
  let originurl = window.location.origin;
// userlogindetails
    // 
    useEffect(()=>{
      if(Object.keys(local).length === 0){
        window.location.href='/'
      }else{
          if(local.usertype === "Admin" || local.usertype === "User" ){
            Setemail(local?local.email:'')
            Setname(local?local.name:'')
            // console.log(userdata)
         }else{
          localStorage.clear();
          window.location.href='/'
          
         }
      } 


      //  getsubscriptiondetails/id

      apiClient.get('/sanctum/csrf-cookie').then( ()=> {
        let url = '/api/getsubscriptiondetails/'+local.id;
        apiClient.get(url, {
          headers:{
            "Authorization":"Bearer "+userdata.token,
            }
        }).then(res=>{
         console.log(res)

         if(res.data){
          Setsubdata(res.data)
         }
          
        })
      })


      apiClient.get('/sanctum/csrf-cookie').then( ()=> {
        let url = '/api/passwordchange';
        apiClient.get(url, {
          headers:{
            "Authorization":"Bearer "+userdata.token,
            }
        }).then(res=>{
            if(res.data.success){
                Setphone(res.data.success?res.data.success.phone:"")
                Setstate(res.data.success?res.data.success.state:"")
                Setcountry(res.data.success?res.data.success.country:"")
                Setcity(res.data.success?res.data.success.city:"")
                Setzipcode(res.data.success?res.data.success.zipcode:"")
            }
          
        }).catch(err=>{
          if(err.response.data.message === 'Unauthenticated.'){
                  
            let myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer "+userdata.token);
            myHeaders.append("Content-Type", "application/json");
            var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
            };
            
            const url = 'http://127.0.0.1:8000/api/logout';
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
        })
    })


// getprofile


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


apiClient.get('/sanctum/csrf-cookie').then( ()=> {
  let url = '/api/subscription';
  apiClient.get(url, {
    headers:{
      "Authorization":"Bearer "+local.token,
      }
  }).then(res=>{
  //    console.log(res)
     Setsent(res.data.success)
      // if(res.data.data){
      //   Setdata(res.data.data)
      //   Setlast(res.data.last_page)
      // }
    
  })
})


      },[])

   

  const handleProfile =()=>{
    let formData = new FormData();
    // let headers = new Headers();
    // headers.append('Content-Type', 'application/json')
    formData.append('name',  name)
    formData.append('email',  email)
    formData.append('phone',  phone)
    formData.append('state',  state)
    formData.append('country',  country)
    formData.append('city',  city)
    formData.append('zipcode',  zipcode)
    let urltwo = '/api/profile';
    apiClient.get('/sanctum/csrf-cookie').then(()=>{
      apiClient.post(urltwo, formData, {
        headers:{
          "Authorization":"Bearer "+userdata.token,
          }
      }).then(res=>{
        console.log(res)
            if(res.data.success){
              Setmessage(res.data.success)
  
            }
   
           }).catch(err=>{
             let error = err.response.data.errors
            //  console.log(error)
             if(error.email){
              Setmessage(error.email[0])                
             }else if(error.name){
              Setmessage(error.name[0])                

             }else if(error.phone){
              Setmessage(error.phone[0])                

             }else if(error.state){
              Setmessage(error.state[0])                

             }else if(error.country){
              Setmessage(error.country[0])                

             }else if(error.city){
              Setmessage(error.city[0])                

             }else if(error.zipcode){
              Setmessage(error.zipcode[0])                

             }
             
             if(err.response.data.message === 'Unauthenticated.'){
                     

              let myHeaders = new Headers();
              myHeaders.append("Authorization", "Bearer "+userdata.token);
              myHeaders.append("Content-Type", "application/json");
              var requestOptions = {
              method: 'GET',
              headers: myHeaders,
              redirect: 'follow'
              };
              
              const url = 'http://127.0.0.1:8000/api/logout';
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
         })
  
  
    })

  }

  const handlepass =()=>{
    let formData = new FormData();
    // let headers = new Headers();
    formData.append('password',  password)
    formData.append('password_confirmation', password_confirmation)
    let urltwo = '/api/changepassword';
    apiClient.get('/sanctum/csrf-cookie').then(()=>{
      apiClient.post(urltwo, formData, {
        headers:{
          "Authorization":"Bearer "+userdata.token,
          }
      }).then(res=>{
        console.log(res)
            if(res.data.success){
             
              Setmessagetwo(res.data.success)
            }
   
           }).catch(err=>{
             let error = err.response.data.errors
             console.log(error)
            if(error.password){
              Setmessagetwo(error.password[0])
             }
         })
  
  
    })
  }


  const handlePic =()=>{
    if(image.type == 'image/jpeg' || image.type == 'image/jpg' || image.type == 'image/png'){
      let formData = new FormData();
      formData.append('image', image)
    let urltwo = '/api/picx';
    apiClient.get('/sanctum/csrf-cookie').then(()=>{
      apiClient.post(urltwo, formData, {
        headers:{
          "Authorization":"Bearer "+userdata.token,
          }
        }).then(res=>{
      if(res.data.success){
        Setmessagethree(res.data.success)
        }

        })
      })

    }else{
      Setmessagethree('Please insert the correct format')
    }
  }
  const handleViewstories =()=>{
    window.location.href = `${originurl}/user/viewstories`;
  }

  console.log(profile)

  const handleCreate = ()=>{
    // if(sent === false){
    //   console.log('not working');
    // }else{
      navigate('/createstories', 
      {state:{id:""}}
      )
  //  }    
  }
  return (
    <div className="w-full bg-white h-fit">
       <Navbar/>
        <section className="w-full sm:w-full md:w-11/12 lg:w-11/12 m-auto items-center bg-white rounded-sm shadow-md mt-2">
            <section className="w-full flex flex-col py-2 sm:w-full sm:flex sm:flex-col sm:py-2  md:w-full md:flex md:flex-row md:py-2 lg:w-full lg:flex lg:flex-row lg:py-2">
            <article className="w-full flex flex-col items-center sm:w-full md:w-1/4  lg:w-1/4 ">
                <span className="w-full  flex flex-col items-center justify-center py-2">
                  {userdata?
                  userdata.usertype === 'User'?
                  <button onClick={handleViewstories} className="text-base text-center capitalize font-medium w-3/4 m-auto rounded-md border btncss py-1">
                  view  stories
                  </button> 
                  :""
                  :""}
                

                  <button onClick={handleCreate} className="text-base text-center capitalize font-medium w-3/4 m-auto rounded-md border btncss  mt-3 py-1">
                   create story
                   </button>
                </span>
                <span  className="w-full  flex flex-col items-center justify-center py-2">
                      <section className='flex flex-row items-center space-x-1'>
                        <span className="text-sm font-extrabold text-center capitalize">Subscribe Name:</span>
                        {/* Object.keys(local).length */}
                      <span className="text-sm font-extrabold text-center capitalize">{Object.keys(subdata).length > 0?subdata.subcription:'none'}</span>
                      </section>

                      <section className='flex flex-row items-center space-x-1 mt-2'>
                        <span className="text-sm font-extrabold text-center capitalize">Days:</span>
                        <span className="text-sm font-extrabold text-center capitalize">{ sent== true?Object.keys(subdata).length > 0?subdata.remainingday:'none':'Expired'} / { sent== true? Object.keys(subdata).length > 0?subdata.days:'none':'Expired'}</span>
                      </section>

                      <section className='flex flex-row items-center space-x-1 mt-2'>
                        <span className="text-sm font-extrabold text-center capitalize">Number of Article:</span>
                        <span className="text-sm font-extrabold text-center capitalize">{sent== true? Object.keys(subdata).length > 0?subdata.number_of_article:"none":"Expired"}</span>
                      </section>
                </span>
             </article>
            <div className="w-full sm:w-full md:w-3/5 lg:w-3/5 ">
            <article className="w-full  flex flex-col items-center">
                 <div className="w-full flex flex-col ">
                     <span className="w-full text-lg sm:w-full sm:text-lg md:w-1/3 md:text-3xl  lg:w-1/3  lg:text-3xl font-extrabold text-left px-3 text-black ">
                      My Account
                     </span>
                     <span className="w-full sm:w-full md:w-1/3 lg:w-1/3 text-lg  font-normal text-left px-3 text-black mt-2">
                        <i className="bg-[#FF6600] text-white">Update your profile</i>
                     </span>
                 </div>

                 <section className='w-full  mt-14'>
                 <div className="w-full float-left px-3 flex flex-row space-x-6 items-center sm:w-10/12 sm:float-left sm:px-3 sm:flex sm:flex-row sm:space-x-6 sm:items-center md:w-2/3 md:float-left md:px-3 md:flex md:flex-row md:space-x-6 md:items-center lg:w-2/3 lg:float-left lg:px-3 lg:flex lg:flex-row lg:space-x-6 lg:items-center">
                    <span className="h-24  w-32 rounded-md border sm:h-24  sm:w-24 sm:rounded-md sm:border  md:h-24  md:w-24 md:rounded-md md:border lg:h-24  lg:w-24 lg:rounded-md lg:border">
                        <img src={Object.keys(profile).length > 0?profile.picture:'https://res.cloudinary.com/the-morgans-consortium/image/upload/v1658329437/Tmc%20institute/blank-profile-picture-gae268b379_1280_gtgqxr.png'} className="w-full h-full object-cover" />
                    </span> 

                    <button className="text-xs h-12 px-2  sm:text-sm sm:h-12 md:text-base md:h-8 lg:text-base lg:h-8 lg:px-4 lg:py-2 capitalize  rounded-md text-white bg-[#FF6600] text-center flex flex-row items-center justify-center" onClick={()=>Setshowx(true)}>
                      upload Avater
                      </button> 

                   </div>
                 </section>

                 <article className="w-11/12  flex flex-col mt-2 sm:w-11/12  sm:flex sm:flex-col sm:mt-2 md:w-full  md:flex md:flex-row md:mt-2 lg:w-full  lg:flex lg:flex-row lg:mt-2">
                  <div className="w-full py-2 gap-4 sm:w-full sm:py-2 sm:gap-4 md:w-1/2 md:py-2 md:gap-4 lg:w-1/2 lg:py-2 lg:gap-4">
                  <span className={message === 'you have successfully created your profile'?"w-full  font-extrabold text-base text-center flex items-center justify-center text-green-400":"w-full  font-extrabold text-base text-center flex items-center justify-center text-red-400"}   >{message?message:''}</span>

                       <div className="w-full m-auto flex flex-col sm:w-full sm:m-auto sm:flex sm:flex-col md:w-11/12 md:m-auto md:flex md:flex-col lg:w-11/12 lg:m-auto lg:flex lg:flex-col ">
                        <span className="text-left text-base font-semibold capitalize">fullname</span>
                        <input type="text" className="w-full  rounded-sm border text-black p-3 mt-1  opacity-40" disabled value={name}  onChange={(e)=>Setname(e.target.value)} />
                        </div> 
                        

                        <div className="w-full m-auto flex flex-col mt-4 sm:w-full sm:m-auto sm:flex sm:flex-col md:w-11/12 md:m-auto md:flex md:flex-col lg:w-11/12 lg:m-auto lg:flex lg:flex-col">
                        <span className="text-left text-base font-semibold capitalize">email</span>
                        <input type="text" className="w-full  rounded-sm border text-black p-3 mt-1 opacity-40" disabled value={email} onChange={(e)=>Setemail(e.target.value)}/>
                        </div>      

                        <div className="w-full m-auto flex flex-col mt-4 sm:w-full sm:m-auto sm:flex sm:flex-col md:w-11/12 md:m-auto md:flex md:flex-col lg:w-11/12 lg:m-auto lg:flex lg:flex-col">
                        <span className="text-left text-base font-semibold capitalize">Contract number</span>
                        <input type="number" className="w-full  rounded-sm border text-black p-3 mt-1" value={phone} onChange={(e)=>Setphone(e.target.value)} />
                        </div>  


                        <section className="w-full flex flex-col  items-center space-x-2 mt-3  sm:w-full sm:flex sm:flex-col  sm:items-center sm:space-x-2 sm:mt-3 md:w-full md:flex md:flex-row  md:items-center md:space-x-2 md:mt-3 lg:w-full lg:flex lg:flex-row  lg:items-center lg:space-x-2 lg:mt-3">
                        <div className=" w-full  flex flex-col sm:w-full  sm:flex sm:flex-col  md:w-1/2 md:m-auto md:flex md:flex-col  lg:w-1/2 lg:m-auto lg:flex lg:flex-col ">
                        <span className="text-left text-base font-semibold capitalize">Country</span>
                        <input type="text" className="w-full  rounded-sm border text-black p-3 mt-1" value={country} onChange={(e)=>Setcountry(e.target.value)} />
                        </div> 
                        

                        <div className=" w-full  flex flex-col sm:w-full  sm:flex sm:flex-col  md:w-2/5 md:m-auto md:flex md:flex-col  lg:w-2/5 lg:m-auto lg:flex lg:flex-col">
                        <span className="text-left text-base font-semibold capitalize">State</span>
                        <input type="text" className="w-full  rounded-sm border text-black p-3 mt-1" value={state} onChange={(e)=>Setstate(e.target.value)} />
                        </div>
                        </section> 

                        
                        <section className="w-full flex flex-col  items-center space-x-2 mt-3  sm:w-full sm:flex sm:flex-col  sm:items-center sm:space-x-2 sm:mt-3 md:w-full md:flex md:flex-row  md:items-center md:space-x-2 md:mt-3 lg:w-full lg:flex lg:flex-row  lg:items-center lg:space-x-2 lg:mt-3">
                        <div className="w-full  flex flex-col sm:w-full  sm:flex sm:flex-col  md:w-1/2 md:m-auto md:flex md:flex-col  lg:w-1/2 lg:m-auto lg:flex lg:flex-col ">
                        <span className="text-left text-base font-semibold capitalize">City</span>
                        <input type="text" className="w-full  rounded-sm border text-black p-3 mt-1" value={city} onChange={(e)=>Setcity(e.target.value)} />
                        </div> 
                        

                        <div className=" w-full  flex flex-col sm:w-full  sm:flex sm:flex-col  md:w-2/5 md:m-auto md:flex md:flex-col  lg:w-2/5 lg:m-auto lg:flex lg:flex-col ">
                        <span className="text-left text-base font-semibold capitalize">Zip Code</span>
                        <input type="number" className="w-full  rounded-sm border text-black p-3 mt-1"  value={zipcode} onChange={(e)=>Setzipcode(e.target.value)} />
                        </div>
                        </section>   

                        <section className="w-full flex flex-row justify-center items-center mt-2">
                            <button className="w-10/12 btncss py-2 rounded-md" onClick={handleProfile}>
                              Submit
                            </button>
                          </section>  
                  </div>
                  <div className="w-full sm:w-full md:w-1/2 lg:w-1/2">
                  <article className="w-full flex flex-col ">
                     <span className="w-full  text-lg sm:w-full  sm:text-lg  md:w-1/2  md:text-lg lg:w-2/3  lg:text-lg font-medium text-left px-3 text-black  mt-2">
                     Change your password
                     </span>
                 </article>
                 <span className={messagetwo === 'your password has been updated'?"w-full  font-extrabold text-base text-center flex items-center justify-center text-green-400":"w-full  font-extrabold text-base text-center flex items-center justify-center text-red-400"}   >{messagetwo?messagetwo:''}</span>

                 <section className="w-full flex flex-col  items-center space-x-2 mt-3  sm:w-full sm:flex sm:flex-col  sm:items-center sm:space-x-2 sm:mt-3 md:w-full md:flex md:flex-col  md:items-center md:space-x-2 md:mt-3 lg:w-full lg:flex lg:flex-col  lg:items-center lg:space-x-2 lg:mt-3">
                        <div className="w-full  flex flex-col sm:w-full  sm:flex sm:flex-col  md:w-full md:m-auto md:flex md:flex-col  lg:w-full lg:m-auto lg:flex lg:flex-col  ">
                        <span className="text-left text-xs sm:text-sm  md:text-sm lg:text-sm font-semibold capitalize">New  Password</span>
                        <input type="password" className="w-full  rounded-sm border text-black p-3 mt-1" value={password} onChange={(e)=>Setpassword(e.target.value)} />
                        </div> 
                        

                        <div className="w-full  flex flex-col sm:w-full  sm:flex sm:flex-col  md:w-full md:mt-2 md:m-auto md:flex md:flex-col  lg:w-full lg:m-auto lg:flex lg:flex-col lg:mt-2">
                        <span className="text-left text-xs sm:text-sm  md:text-sm lg:text-sm font-semibold capitalize">Confirm New Password</span>
                        <input type="password" className="w-full  rounded-sm border text-black p-3 mt-1" value={password_confirmation} onChange={(e)=>Setpassword_confirmation(e.target.value)} />
                        </div>
                        </section>   

                        <section className="w-full flex flex-row justify-center items-center mt-2">
                            <button className="w-10/12 btncss py-2 rounded-md" onClick={handlepass}>
                              Save Changes
                            </button>
                          </section>  
                    </div>
                 </article>


              </article>
            </div>
            </section>
        

        </section>


        <article className={showx?"bg-cover top-0 left-0 right-0   bottom-0 bg-black bg-opacity-10 bg-op  z-30 absolute flex flex-row items-center  justify-center  overflow-y-scroll py-4":"hidden"} >

         <div className="w-11/12 sm:w-10/12 md:w-1/2 lg:w-1/3 rounded-md bg-white   py-2 px-2  text-2xl h-96 "  >
                       <section className='w-full'>
              <aside className=' float-right flex flex-row items-center justify-center py-2 '>
                  <button className='w-6 h-6  rounded-full bg-white text-blue-500 grid place-content-center text-sm font-extrabold' onClick={()=>Setshowx(false)} >x</button>
              </aside>
            </section> 
                  <div className="w-full grid place-content-center text-center">
                    <p className={messagethree === "you have uploaded your profile picture"?'text-base text-center text-green-500':'text-base text-center text-red-500'}   >{messagethree?messagethree:""}</p>
                    <span className="mt-9 w-11/12">
                      <input type="file" onChange={(e)=>Setimage(e.target.files[0])} className='w-full'/>
                    </span>
                      <span className='mt-2 w-11/12'>
                        <button className="w-full text-lg text-white bg-blue-500 rounded-md p-2" onClick={handlePic}>
                          submit
                        </button>
                      </span>
                    </div>          
                       </div>
          
          </article>

    </div>
  )
}
