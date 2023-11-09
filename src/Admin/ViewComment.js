import React,{useEffect, useState} from 'react';
import Navbar from '../component/Navbar';
import { AES, enc } from 'crypto-js';
import axios from 'axios';
import { Markup } from 'interweave';
import ReactPaginate from 'react-paginate';
import Echo from 'laravel-echo';
import { useNavigate } from 'react-router-dom';
let local = localStorage.getItem('userlogindetails')?JSON.parse(AES.decrypt(localStorage.getItem('userlogindetails'), 'GRCMAZAGINE').toString(enc.Utf8)):{}

export default function ViewComment() {
    let url = window.location.origin
 const [data, Setdata] = useState([]);
 const [last, Setlast] = useState(0)
    const apiClient = axios.create({
        baseURL: "http://api.grcfincrimetoday.org",
        withCredentials: true
      });
      const navigate = useNavigate();

    useEffect(()=>{
        //getarticleadmin

        if(Object.keys(local).length === 0){
          // window.location.href = `${url}/`
           navigate('/') 

        }else{
            if(local.usertype === "Admin" ){
         
           }else{
            navigate('/') 
            // window.location.href = `${url}/`
          }
        } 
  

        apiClient.get('/sanctum/csrf-cookie').then( ()=> {
            let url = '/api/getarticleadmin/?search='+1;
            apiClient.get(url,{
              headers:{
                "Authorization":"Bearer "+local.token,
                }
            }).then(res=>{
                // console.log(res)
                // console.log(res.data.success)
                 if(res.data.success){
                    Setdata(res.data.success.data)
                    Setlast(res.data.success.last_page)
                 }        
      
            })
      })




      window.Echo = new Echo({
        broadcaster: 'pusher',
        key: 'f959c4bf7c6b75daca59',
        cluster: 'eu',
        encrypted:true,
        forceTLS: true,
      });

      var channel = window.Echo.channel('articles');
      channel.listen('.all_articles',function(data) {
        //  Setcomment(data.data)
        Setdata(data.data.data)
        Setlast(data.data.last_page)
      })

    },[])



    const handleRedirect =(code)=>{
      navigate(`/single/${code}`) 

        // window.location.href = `${url}/single/${code}`;
    }
    const handleNext =(data)=>{
        let Answer = data.selected + 1;
        apiClient.get('/sanctum/csrf-cookie').then( ()=> {
            let url = '/api/getarticleadmin/?search='+Answer;
            apiClient.get(url,{
              headers:{
                "Authorization":"Bearer "+local.token,
                }
            }).then(res=>{
                // console.log(res.data.success)
                 if(res.data.success){
                    Setdata(res.data.success.data)
                    Setlast(res.data.succes.last_page)
                 }        
      
            })
      })
    }
    return (
        <div>
            <Navbar/>
            <div className='w-full bg-white flex flex-col items-center justify-center'>
               
               <section className='mt-10 w-10/12  overflow-x-scroll  sm:mt-10 sm:w-10/12 sm:overflow-x-scroll  md:mt-10 md:w-10/12 md:overflow-hidden  lg:mt-10 lg:w-10/12 lg:overflow-hidden '> 
               <table className='w-full rounded-sm border'>
                <thead>
                    <tr>
                    <th className='text-center capitalize text-black text-base sm:text-base md:text-lg lg:text-lg py-2 border-b-2 border-black'>Number</th>
                <th className='text-center capitalize text-black text-xs sm:text-base md:text-lg lg:text-lg py-2 border-b-2 border-black'>title</th>
                <th className='text-center capitalize text-black text-xs sm:text-base md:text-lg lg:text-lg py-2 border-b-2 border-black'>Number of Comments</th>
                <th  className='text-center capitalize text-black text-xs sm:text-base md:text-lg lg:text-lg py-2 border-b-2 border-black'>action</th>
                    </tr>
       
                </thead>
                <tbody>
                    {data.length > 0? data.map((item, index)=>{
                        // console.log(item)
                      return     <tr key={index}>
                      <td className='text-center text-base py-2'>{index + 1}</td>
                      <td className='text-center text-base px-2 py-2'><Markup content={item.articlename} /> </td>
                      <td className='text-center text-base px-2 py-2'>{item.countmessage}</td>
                      <td className='flex flex-row items-center justify-center py-2'>
                            <button className='text-center capitalize bg-blue-500 rounded-sm text-white px-4' onClick={()=>handleRedirect(item.encryptid)}>
                              view
                            </button>
                      </td>
                  </tr>

                    }) :""}
                
                  
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
