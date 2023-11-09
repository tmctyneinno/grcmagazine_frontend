import React, {useEffect, useState, useMemo} from 'react'
import Navbar from '../component/Navbar';
import ReactPaginate from 'react-paginate';
import { AES, enc } from 'crypto-js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
let local = localStorage.getItem('userlogindetails')?JSON.parse(AES.decrypt(localStorage.getItem('userlogindetails'), 'GRCMAZAGINE').toString(enc.Utf8)):{}
export default function AdminAdvest() {
    const [last, Setlast] = useState(0);
    const [data, Setdata] = useState([]);
    const [ishow, Setishow] = useState(false)
    const [image, Setimage] = useState('')
    const [name, Setname] = useState('')
    const [email, Setemail] = useState('')
    const [message, Setmessage] = useState('')
    let originurl = window.location.origin;
    const apiClient = axios.create({
      baseURL: "http://api.grcfincrimetoday.org",
      withCredentials: true
    });

    useEffect(()=>{
        apiClient.get('/sanctum/csrf-cookie').then( ()=> {
            let url = '/api/adverstdetall/?page='+1;
            apiClient.get(url, {
              headers:{
                "Authorization":"Bearer "+local.token,
                }
            }).then(res=>{
                console.log(res)
                if(res.data.success){
                  Setdata(res.data.success.data)
                  Setlast(res.data.success.last_page)
                }
              
            }).catch(err=>{})
        })  
    },[])

    const handleNext =(data)=>{
        let Answer = data.selected + 1;

        apiClient.get('/sanctum/csrf-cookie').then( ()=> {
            let url = '/api/adverstdetall/?page='+Answer;
            apiClient.get(url, {
              headers:{
                "Authorization":"Bearer "+local.token,
                }
            }).then(res=>{
                if(res.data.success){
                  Setdata(res.data.success.data)
                  Setlast(res.data.success.last_page)
                }
              
            }).catch(err=>{})
        })

    }


    const handleimage=(image, name, email, message)=>{
        Setimage(image)
        Setishow(true)
        Setname(name)
        Setemail(email)
        Setmessage(message)
    }
 
    const handleClose=()=>{
        Setimage('')
        Setishow(false)
        Setname('')
        Setemail('')   
        Setmessage('')
    }

    // const handleMessage =(message, name, email)=>{
    //     Setmessage(message)
    //     Setishow(true)
    //     Setname(name)
    //     Setemail(email)
    // }
  
    return (
        <div className="w-full">
        <Navbar/>
   
        <div className={data.length > 0?"w-full bg-white py-4 h-fit":"w-screen bg-white py-4 h-screen"}>
           <section className="w-11/12 m-auto  shadow-md   over sm:w-11/12 sm:m-auto sm:round-lg sm:shadow-md sm:over md:w-3/4 md:m-auto md:round-lg md:overflow-hidden md:shadow-md lg:w-3/4 lg:m-auto lg:overflow-hidden lg:round-lg lg:shadow-md ">
           <table className="w-screen sm:w-screen md:w-full lg:w-full     rounded-lg">
               <tr className=' '>
                   <th className='capitalize text-xs sm:text-base md:text-lg lg:text-lg text-center py-4 text-black  font-extrabold border-t-0 border-b-2 '>No</th>
                   <th className='capitalize text-xs sm:text-xs md:text-lg text-center py-4  text-black  font-extrabold border-b-2'>Name</th>
                   <th className='capitalize text-xs sm:text-base md:text-lg text-center py-4 text-black  font-extrabold border-b-2'>email</th>
                   <th className='capitalize text-xs sm:text-base md:text-lg text-center py-4  text-black  font-extrabold border-b-2'>Message</th>
                   <th className='capitalize text-xs sm:text-base md:text-lg text-center py-4  text-black  font-extrabold border-b-2'>Action</th>
 
                   {/* <th className='capitalize text-xs sm:text-base md:text-lg text-center py-4 text-black  font-extrabold border-b-2'>action</th> */}
               </tr>
               <tbody>
   
                 {data.length > 0?
                 data.map((item, index)=>{
                 return  <tr key={index}>
                   <td className='capitalize  text-base text-black text-center py-4 border-b-2'>{index + 1}</td>
                   <td className='capitalize text-xs sm:text-sm md:text-base lg:text-base text-black text-center py-4 border-b-2' >{item.name}</td>
                   <td className='capitalize text-xs sm:text-sm md:text-base lg:text-base text-black font-normal text-center py-4 border-b-2' >{item.email} </td>
                   {/* <td className='capitalize text-xs sm:text-sm md:text-base lg:text-base text-black text-center py-4 border-b-2'>{item.date}</td> */}
                   <td className='capitalize text-xs sm:text-sm md:text-base lg:text-base text-black text-center py-4 border-b-2'> {item.message.substring(0, 30)+'...'} </td>
                   <td className='capitalize text-xs sm:text-sm md:text-base lg:text-base text-black text-center py-4 border-b-2 px-2 flex flex-row items-center justify-center'>
                   <button className='rounded-md grid place-content-center text-xs capitalize bg-blue-600 text-white  py-3 px-3 w-16 sm:px-3 sm:py-3 sm:w-16 md:py-1 md:px-1 lg:px-1 lg:py-1' onClick={()=>handleimage(item.image, item.name, item.email, item.message) }>view</button>

                     </td>
                  </tr>
                 })
                 
                 
                 :""}
             
          
             
               
              
               </tbody>
           </table>
   
           </section>
   
   
           <article className="w-3/4  over  sm:w-3/4 sm:over md:w-3/4 md:overflow-hidden lg:w-3/4 lg:overflow-hidden m-auto px-3 mt-4">
         <aside className="w-42 float-left  px-2 py-2   space-x-3 flex items-center justify-center ">
          <ReactPaginate
                       previousLabel={'previous'}
                       nextLabel={'next'}
                         pageCount={last}
                         breakLabel={"..."}  
                         marginPagesDisplayed={1}
                         pageRangeDisplayed={1}
                         onPageChange={handleNext}
                         containerClassName={'inline-flex items-center justify-center '}
                         pageClassName={'m-2'}
                         pageLinkClassName={'h-10 px-5 text-[#FF6600] transition-colors duration-150 bg-white focus:shadow-outline hover:bg-white hover:text-[#FF6600]'}
                         previousClassName={'h-10 bg-[#FF6600] px-5 text-indigo-600 text-xs transition-colors text-center duration-150 bg-white focus:shadow-outline hover:bg-indigo-500 flex items-center justify-center rounded-tl-lg rounded-bl-lg hover:text-white    md:h-10 md:px-5 md:text-indigo-600 md:transition-colors md:text-center md:duration-150 md:bg-white md:focus:shadow-outline md:hover:bg-indigo-500 md:flex md:items-center md:justify-center md:rounded-tl-lg md:rounded-bl-lg md:hover:text-white'}
                         nextClassName={'h-10 bg-[#FF6600] px-5 text-indigo-600 transition-colors text-center text-xs duration-150 bg-white focus:shadow-outline hover:bg-indigo-500 flex items-center justify-center rounded-tr-lg rounded-br-lg hover:text-white     md:h-10 md:px-5 md:text-indigo-600 md:transition-colors md:text-center md:duration-150 bg-white md:focus:shadow-outline md:hover:bg-indigo-500 md:flex md:items-center md:justify-center md:rounded-tr-lg md:rounded-br-lg md:hover:text-white'}
                       /> 
       
       </aside>  
     
         </article>
        </div>



        <article className={ishow?"bg-cover top-0 left-0 right-0 bottom-0 bg-black bg-opacity-10 bg-op fixed z-10 flex flex-row items-center  justify-center  overflow-y-scroll py-4":'hidden'} >
          
              <section className="w-3/4 flex flex-col items-center bg-white rounded-md text-black">
              <div className="w-full ">
             <aside className=' float-right flex flex-row items-center justify-center py-4 '>
                  <button className='w-6 h-6  rounded-full bg-white text-blue-500 text-center text-lg font-extrabold m-auto mr-4' onClick={handleClose} >x</button>
              </aside>
              </div> 
           
                
                <div className='w-11/12   rounded-md text-center flex flex-row items-center' style={{ height:"370px" }}>
                <img src={image} alt='image' className='w-full h-full rounded-md' />
             </div>
             <div className='w-11/12   rounded-md text-center flex flex-row items-center justify-center px-2 py-2 font-semibold text-lg' style={{ height:"150px" }}>
                      
                      {message}
                 </div>
            
              <div className="w-full text-center flex flex-row items-center justify-center text-lg">Name:{name} </div>
              <div className="w-full text-center flex flex-row items-center justify-center text-lg">Email:{email} </div>

              </section>
         
           </article>
     
       </div>
   
    )
}
