import React, {useEffect, useState} from 'react';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';
import { BsFacebook, BsInstagram, BsTwitter, BsLinkedin, BsSearch } from 'react-icons/bs';
import axios from 'axios';
import { Markup } from 'interweave';
import ReactPaginate from 'react-paginate';
import { AES, enc } from 'crypto-js';
import { useNavigate } from 'react-router-dom';
let local = localStorage.getItem('userlogindetails')?JSON.parse(AES.decrypt(localStorage.getItem('userlogindetails'), 'GRCMAZAGINE').toString(enc.Utf8)):{}

export default function List() {
    const [data, Setdata] = useState([])
    const [last, Setlast] = useState([])
    const [recent, Setrecent] = useState([])
    const [categoriesdata, Setcategoriesdata] = useState([])
    const [search, Setserch] = useState('')
    const [sent, Setsent] = useState(false)
    const apiClient = axios.create({
        baseURL: "http://api.tmcinstitute.com",
        withCredentials: true
      });
      const navigate = useNavigate();
      let url = window.location.origin
      const handleRead =(id)=>{

        if(Object.keys(local).length === 0){
            window.location.href = `${url}/user/login`; 

          }else{
           // window.location.href = `${url}/single/${code}`;

            if(sent === false){
                window.location.href = `${url}/user/login`; 

              }else{
                window.location.href = `${url}/single/${id}`;
            }         
             }
      }

      useEffect(()=>{
        apiClient.get('/sanctum/csrf-cookie').then( ()=> {
            let url = '/api/list/';
            apiClient.get(url).then(res=>{
                // console.log(res)
                Setdata(res.data.pagdata.data)
                Setlast(res.data.pagdata.last_page)
                Setrecent(res.data.recent)
                Setcategoriesdata(res.data.categoriesdata)
            })
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

    //   console.log(sent)
      const handleNext =(data)=>{
        let Answer = data.selected + 1;
        let formData = new FormData();
        formData.append('page', Answer)
        let urltwo = `/api/listpag`;
        apiClient.get('/sanctum/csrf-cookie',{
       
        }).then( ()=> {
            apiClient.post(urltwo, formData).then(res=>{
            // console.log(res)
           if(res.data){
            Setdata(res.data.data)
            Setlast(res.data.last_page)
           }
          })
        })
      }




      const handleSearch =(e)=>{
          let wordx = e.target.value
        //   console.log(wordx)
          Setserch(wordx)
         if(wordx !== '' || wordx.length > 1){
            apiClient.get('/sanctum/csrf-cookie').then( ()=> {
                apiClient.get('/api/searcharticles/'+wordx).then(res=>{
                    // console.log(res)
                    if(res.data){
                 Setdata(res.data)
                    }
             

                })
            })
         }else{

               apiClient.get('/sanctum/csrf-cookie').then( ()=> {
            let url = '/api/list/';
            apiClient.get(url).then(res=>{
                // console.log(res)
                Setdata(res.data.pagdata.data)
                Setlast(res.data.pagdata.last_page)
                Setrecent(res.data.recent)
                Setcategoriesdata(res.data.categoriesdata)
            })
        })

         }
      }

      const handleRedirect =(code)=>{
        if(Object.keys(local).length === 0){
            navigate(`/user/login`)

          }else{
            if(sent === false){
                navigate(`/user/login`)
              }else{
                navigate( `/single/${code}`)
              }         
             }

      }

    //   console.log(sent)
    return (
        <section>
            <Navbar/>
<div className="container">
        <div className="row">
            <div className="col-lg-12 col-sm-12 col-md-12 col-xs-12">
                <div className="page-breadcrumb">
                    <ol className="breadcrumb">
                        <li><a href="index.html">Home</a></li>
                        <li className="active">Stories</li>
                    </ol>
                </div>
            </div>
            <div className="col-lg-12 col-sm-12 col-md-12 col-xs-12">
                <div className="page-section">
                    <h1 className="page-title">Stories</h1></div>
            </div>
            <div className='w-full m-auto '>
               <div className="w-11/12 flex  flex-row  items-center justify-center  sm:w-1/3 sm:flex  sm:flex-row  sm:items-center   sm:justify-center  md:w-3/4 md:flex  md:flex-row  md:items-center md:justify-center md:float-left lg:w-3/5 lg:flex  lg:flex-row  lg:items-center lg:justify-center ">
                  <section className="w-4/5 relative sm:w-10/12 sm:relative md:w-10/12 md:relative lg:w-10/12 lg:relative">
                  <input type="text" className="w-full outline-0 border p-2 rounded-l-lg" value={search} onChange={(e)=> handleSearch(e)} placeholder="search for articles" />
                       <span className='w-10 absolute right-0 top-3 sm:right-0 sm:top-3 md:top-3 md:right-0 lg:top-3 lg:right-0'>
                        <BsSearch className='text-base font-medium'/>
                       </span>
                  </section>
                  {/* <section className="w-1/6">
                   <button className="w-full text-center  font-medium rounded-r-lg bg-[#FF6600] p-1 h-10 text-white" onClick={handleSearch}>
                    search
                   </button>
                  </section> */}
               </div>
            </div>
        </div>
    </div>
    
    
    <div className="content">
        <div className="container">
            <div className="row">
                <div className="col-lg-8 col-sm-8 col-md-8 col-xs-12">
                    <div className="row">
    
                        <div className="products-center rowpagone">

                            {data.length > 0?
                             data.map((item, index)=>{
                                if(item.articlename !== '<strong>Introduction</strong>' && item.status === 1){
                                 return   <div class="realwedding-block" key={index} onClick={()=>handleRedirect(item.id)}>
                                    <div class="realwedding-img">
                                        <a  class="imagehover"><img src={item.picture} alt=""/></a>
                                    </div>
                                    <div class="realwedding-content">
                                       <p>
                                        <h2><a  class="title"><Markup content={item.articlename} /></a></h2>
                                        <p class="meta">
                                            <span class="meta-category">
                                        <a  class="meta-link">year</a></span> <span class="meta-date">{item.yearup}</span>
                                            <span class="meta-author"><a  class="meta-link">{item.categories}</a></span>
                                        </p> <Markup content={item.articlebodyone.substring(0,200)} />...</p></div>
                                        
                                    </div>
                                                                
                                }
                             })
                            :[]}
    
                    
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12 col-sm-12 col-md-12 col-xs-12 flex flex-row items-center justify-center">
                            {/* <ul className="pagination">
                                <li className=" Previous">
                                    <a  aria-label="">
                                        <span aria-hidden="true"><i className="fa fa-chevron-left" aria-hidden="true"></i></span>
                                    </a>
                                </li>
                                <li className="active"><a className="numberpag">1</a></li>
                    
                                <li className="Next">
                                    <a  aria-label=" ">
                                        <span aria-hidden="true"><i className="fa fa-chevron-right" aria-hidden="true"></i></span>
                                    </a>
                                </li>
                            </ul> */}

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
                    pageLinkClassName={'bg-[#FF6600] px-2 py-2 rounded-md   sm:bg-[#FF6600] sm:rounded-md sm:px-2 sm:py-2     md:bg-[#FF6600] md:px-3 md:rounded-md md:py-2 lg:rounded-md  lg:bg-[#FF6600] lg:px-4 lg:w-14 lg:py-2 lg:text-white hover:text-white '}
                    previousClassName={'bg-[#FF6600] px-1 py-1  rounded-l-lg sm:bg-[#FF6600] sm:px-1 sm:py-1  rounded-l-lg md:bg-[#FF6600] md:px-2 md:py-2  md:rounded-l-lg lg:bg-[#FF6600] lg:flex lg:flex-row lg:items-center lg:px-3 lg:py-2  lg:h-10 lg:rounded-l-lg lg:text-white hover:text-white  '}
                    nextClassName={'bg-[#FF6600] px-1 py-1  rounded-r-lg sm:bg-[#FF6600] sm:px-1 sm:py-1  rounded-r-lg md:bg-[#FF6600] md:px-2 md:py-2  md:rounded-r-lg lg:bg-[#FF6600] lg:flex lg:flex-row lg:items-center lg:px-4 lg:py-2 lg:h-10  lg:rounded-r-lg lg:text-white hover:text-white  '}
                  />
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12 mt-2  sm:mt-2  md:mt-0 lg:mt-0">
                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div className="widget widget-categories">
                                <h2 className="widget-title">categories</h2>
                                <ul>
                                {categoriesdata.length > 0?
                                    categoriesdata.map((item, index)=>{
                                        if(item.categories != 'Introduction'){
                                        return  <li key={index}><a >{item.categories}</a><span class="badge">{item.number}</span></li>
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
                                     recent.map((item, index)=>{
                                        return  <li key={index}>
                                        <h4><a onClick={()=>handleRead(item.id)} className="post-title"><Markup content={item.articlename} /></a></h4>
                                        <p className="meta"><span className="meta-category"><a onClick={()=>handleRead(item.id)} className="meta-link">{ item.categories }</a></span> <span className="meta-date">{ item.yearup }</span>
                                        </p>
                                    </li>
                                     })
                                    :[]}

                                </ul>
                            </div>
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
