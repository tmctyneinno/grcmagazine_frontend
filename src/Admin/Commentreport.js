import React, {useState, useEffect} from 'react'
import Navbar from '../component/Navbar';
import axios from 'axios';
import { AES, enc } from 'crypto-js';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';

let local = localStorage.getItem('userlogindetails')?JSON.parse(AES.decrypt(localStorage.getItem('userlogindetails'), 'GRCMAZAGINE').toString(enc.Utf8)):{}

export default function Commentreport() {
    const [data, Setdata] = useState([])
    const [last, Setlast] = useState(1)
    const [userdata, Setuserdata] = useState(local?local:{})
   const  [page, Setpage] = useState(1)
   let originurl = window.location.origin;
   const navigate = useNavigate();

    const apiClient = axios.create({
        baseURL: "http://api.tmcinstitute.com",
        withCredentials: true
      });
    useEffect(()=>{
      if(Object.keys(local).length === 0){
        window.location.href = `${originurl}/`
      }else{
          if(local.usertype === "Admin" ){
       
         }else{
          // window.location.href = `${originurl}/`
          navigate('/')
        }
      } 



        apiClient.get('/sanctum/csrf-cookie').then( ()=> {
            let url = '/api/reportdetail/?page='+page;
            apiClient.get(url, {
              headers:{
                "Authorization":"Bearer "+local.token,
                }
            }).then(res=>{
                 
                 Setdata(res.data.success.data)
                 Setlast(res.data.success.last_page)
            })
      })
    },[])
    const handleNext =(data)=>{
    //  reportdetail
    let Answer = data.selected + 1;

    apiClient.get('/sanctum/csrf-cookie').then( ()=> {
      let url = '/api/reportdetail/?page='+Answer;
      apiClient.get(url, {
        headers:{
          "Authorization":"Bearer "+local.token,
          }
      }).then(res=>{
          Setdata(res.data.success.data)
          Setlast(res.data.success.last_page)

      })
})
    }

    const handleSingle =(articles_id)=>{
      // window.location.href = `${originurl}/single/${articles_id}` 
      navigate('/single/${articles_id}')

    }
  return (
    <div className="w-full">
     <Navbar/>

     <div className={data.length > 0?"w-full bg-white py-4 h-fit":"w-screen bg-white py-4 h-screen"}>
        <section className="w-11/12 m-auto  shadow-md   over sm:w-11/12 sm:m-auto sm:round-lg sm:shadow-md sm:over md:w-3/4 md:m-auto md:round-lg md:overflow-hidden md:shadow-md lg:w-3/4 lg:m-auto lg:overflow-hidden lg:round-lg lg:shadow-md ">
        <table className="w-screen sm:w-screen md:w-full lg:w-full     rounded-lg">
            <tr className=' '>
                <th className='capitalize text-xs sm:text-base md:text-lg lg:text-lg text-center py-4 text-black  font-extrabold border-t-0 border-b-2 '>No</th>
                <th className='capitalize text-xs sm:text-xs md:text-lg text-center py-4  text-black  font-extrabold border-b-2'>user </th>
                <th className='capitalize text-xs sm:text-base md:text-lg text-center py-4 text-black  font-extrabold border-b-2'>comment reported</th>
                <th className='capitalize text-xs sm:text-base md:text-lg text-center py-4 text-black  font-extrabold border-b-2'>message</th>
                <th className='capitalize text-xs sm:text-base md:text-lg text-center py-4 text-black  font-extrabold border-b-2'>action</th>
            </tr>
            <tbody>

              {data.length > 0?
              data.map((item, index)=>{
              return  <tr key={index}>
                <td className='capitalize  text-base text-black text-center py-4 border-b-2'>{index+1}</td>
                <td className='capitalize text-xs sm:text-sm md:text-base lg:text-base text-black text-center py-4 border-b-2' >{item.username} </td>
                <td className='capitalize text-xs sm:text-sm md:text-sm lg:text-sm text-black font-normal text-center py-4 border-b-2' >{item.comment_message}</td>
                <td className='capitalize text-xs sm:text-sm md:text-sm lg:text-sm text-black font-normal text-center py-4 border-b-2' >{item.message}</td>
                <td className='capitalize text-xs sm:text-sm md:text-base lg:text-base text-black text-center py-4 border-b-2 px-2'>
                  {/* <span className='w-10/12 m-auto space-x-3 grid grid-cols-1 place-content-center gap-2 sm:grid sm:grid-cols-1 sm:gap-2 sm:place-content-center md:grid md:grid-cols-2 md:gap-2 lg:grid lg:grid-cols-2 lg:gap-2 lg:place-content-center m-auto'> */}

                  <button className='rounded-md flex justify-center items-center text-xs capitalize m-auto bg-blue-600 text-white  py-3 px-3 w-16 sm:px-3 sm:py-3 sm:w-16 md:py-1 md:px-1 lg:px-1 lg:py-1' onClick={()=>handleSingle(item.articles_id)}>
                  view
                  </button>

                  {/* </span> */}
                
                  
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
