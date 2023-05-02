import React, {useEffect, useState, useMemo} from 'react'
import Navbar from '../component/Navbar';
import { Markup } from 'interweave';
import { AES, enc } from 'crypto-js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

let local = localStorage.getItem('userlogindetails')?JSON.parse(AES.decrypt(localStorage.getItem('userlogindetails'), 'GRCMAZAGINE').toString(enc.Utf8)):{}

export default function ViewStories() {
    const [last, Setlast] = useState(0);
    const [data, Setdata] = useState([]);
    const [userdata, Setuserdata] = useState(local?local:{})
    const [num, Setnum] = useState(1);

// userstories
let originurl = window.location.origin;
const navigate = useNavigate();

const apiClient = axios.create({
    baseURL: "http://127.0.0.1:8000",
    withCredentials: true
  });

useEffect(()=>{

    if(Object.keys(local).length === 0){
      // console.log(local)

    }else{
      // console.log(local)
      //   if(local.usertype === "Admin" || local.usertype === "User" ){
      //     // console.log(userdata)
      //  }else{
      //   localStorage.clear();
      //   window.location.href='/'
        
      //  }
    } 
  
  
  },[])
  // console.log(userdata.usertype)
useEffect(()=>{
    apiClient.get('/sanctum/csrf-cookie').then( ()=> {
        let url = '/api/userstories/?page='+num;
        apiClient.get(url, {
          headers:{
            "Authorization":"Bearer "+userdata.token,
            }
        }).then(res=>{
          // console.log(res)
            if(res.data.data){
              Setdata(res.data.data)
              Setlast(res.data.last_page)
            }
          
        }).catch(err=>{
          if(err.response.data.message == 'Unauthenticated.'){
                  
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
                    // window.location.href='/'
                    navigate('/' )

                }
            })
            .catch(error => console.log(error));
               })
 
          }
        })
    })


  },[])


  const handleview =(encryptid)=>{
    // window.location.href = `${originurl}/single/${encryptid}`
    navigate(`/single/${encryptid}`)

   }


  const handleNag =(enid)=>{
    navigate('/createstories', 
    {state:{id:enid}}
    )
  }



  const handleNext =(data)=>{
    let Answer = data.selected + 1;
    apiClient.get('/sanctum/csrf-cookie').then( ()=> {
      let url = '/api/userstories/?page='+Answer;
      apiClient.get(url, {
        headers:{
          "Authorization":"Bearer "+userdata.token,
          }
      }).then(res=>{
          if(res.data.data){
            Setdata(res.data.data)
            Setlast(res.data.last_page)
          }
        
      }).catch(err=>{
        if(err.response.data.message == 'Unauthenticated.'){
  
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
                  // window.location.href='/'
                  navigate('/')

              }
          })
          .catch(error => console.log(error));
             })
            


        }
      })
  })

  }


    return (
        <div className='w-full'>
                 <Navbar/>
                 <div className={data.length > 0?"w-full bg-white py-4 h-fit":"w-screen bg-white py-4 h-screen"}>
        <section className="w-11/12 m-auto  shadow-md   over sm:w-11/12 sm:m-auto sm:round-lg sm:shadow-md sm:over md:w-3/4 md:m-auto md:round-lg md:overflow-hidden md:shadow-md lg:w-3/4 lg:m-auto lg:overflow-hidden lg:round-lg lg:shadow-md ">
        <table className="w-screen sm:w-screen md:w-full lg:w-full     rounded-lg">
            <tr className=' '>
                <th className='capitalize text-xs sm:text-base md:text-lg lg:text-lg text-center py-4 text-black  font-extrabold border-t-0 border-b-2 '>No</th>
                <th className='capitalize text-xs sm:text-xs md:text-lg text-center py-4  text-black  font-extrabold border-b-2'>author</th>
                <th className='capitalize text-xs sm:text-base md:text-lg text-center py-4 text-black  font-extrabold border-b-2'>title</th>
                <th className='capitalize text-xs sm:text-base md:text-lg text-center py-4  text-black  font-extrabold border-b-2'>Date</th>
                <th className='capitalize text-xs sm:text-base md:text-lg text-center py-4  text-black  font-extrabold border-b-2'>status</th>
                <th className='capitalize text-xs sm:text-base md:text-lg text-center py-4 text-black  font-extrabold border-b-2'>action</th>
            </tr>
            <tbody>
            {data.length > 0?
              data.map((item, index)=>{
              return  <tr key={index}>
                <td className='capitalize  text-base text-black text-center py-4 border-b-2'>{index + 1}</td>
                <td className='capitalize text-xs sm:text-sm md:text-base lg:text-base text-black text-center py-4 border-b-2' onClick={()=>handleview(item.encryptid)}>{item.author}</td>
                <td className='capitalize text-xs sm:text-sm md:text-base lg:text-base text-black font-normal text-center py-4 border-b-2' onClick={()=>handleview(item.encryptid)}><Markup content={item.title} /></td>
                <td className='capitalize text-xs sm:text-sm md:text-base lg:text-base text-black text-center py-4 border-b-2'>{item.date}</td>
                <td className='capitalize text-xs sm:text-sm md:text-base lg:text-base text-black text-center py-4 border-b-2'>{item.status?'Approved':'Not Approved'}</td>
                <td className='capitalize text-xs sm:text-sm md:text-base lg:text-base text-black text-center py-4 border-b-2 px-2'>
                  <span className='w-10/12 m-auto space-x-3 grid grid-cols-2 place-content-center'>
                 <button className='rounded-md grid place-content-center text-xs capitalize bg-blue-600 text-white px-1 py-1' onClick={()=>handleNag(item.encryptid)}>
                  Edit
                  </button>

                  </span>
                
                  
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
        </div>
    )
}
