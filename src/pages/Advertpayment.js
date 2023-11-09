import React from 'react'
import Navbar from '../component/Navbar'
import CurrencyFormat from 'react-currency-format';
import axios from 'axios';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AES, enc } from 'crypto-js';
import PaystackPop from '@paystack/inline-js';
import { useNavigate } from 'react-router-dom';
let local = localStorage.getItem('userlogindetails')?JSON.parse(AES.decrypt(localStorage.getItem('userlogindetails'), 'GRCMAZAGINE').toString(enc.Utf8)):{}
export default function Advertpayment() {
    let {id} = useParams()
    const navigate = useNavigate();
    const apiClient = axios.create({
        baseURL: "http://api.grcfincrimetoday.org",
        withCredentials: true
      });
      let original = 'http://127.0.0.1:3000';

    const data =[
        {id:0, image:'https://res.cloudinary.com/okpeku/image/upload/v1682330129/dinu-j-nair-fzFZCJTyoTo-unsplash_wldjgc.jpg', name:'normal', price:2500, days:30 },
        {id:1, image:'https://res.cloudinary.com/okpeku/image/upload/v1682330129/dinu-j-nair-fzFZCJTyoTo-unsplash_wldjgc.jpg', name:'super', price:4000, days:45 },
        {id:2, image:'https://res.cloudinary.com/okpeku/image/upload/v1682330129/dinu-j-nair-fzFZCJTyoTo-unsplash_wldjgc.jpg', name:'extra super', price:4500, days:55 },
    ]

    useEffect(()=>{
        apiClient.get('/sanctum/csrf-cookie').then( ()=> {
            let url = '/api/checkads/?id='+id;
            apiClient.get(url,{
              headers:{
                "Authorization":"Bearer "+local.token,
                }
            }).then(res=>{
               console.log(res)
              if(res.data.success == true){
                navigate(`/Advert`)
                // window.location.href = `${original}/Advert`
              }          
      
            })
        })
    },[])

  const handleClick =(name, days, price)=>{


    let paystack = PaystackPop.setup({
        key: 'pk_test_717211460dbb54580490c8c657c4b42e4e35da03',
        email: local.email,
        amount: parseInt(price) * 100,
     
        callback: function(response){
           let ref = response.reference
           
         apiClient.get('/sanctum/csrf-cookie').then( ()=> {
          let hypelink = `/api/paystack_verify/${ref}`
         apiClient.get(hypelink,{
             headers:{
               "Authorization":"Bearer "+local.token,
               }
           }).then(res=>{
             if(res.data.success){
               let data = JSON.parse(res.data.success);
  


               let formData = new FormData();
                formData.append('adname',  name)
                formData.append('adprice',  price)
                formData.append('addays',  days)
                formData.append('advestments_id',  id)
                formData.append('user_id',  local.id)
                formData.append('code',  ref)
                formData.append('message',  data.message)
                formData.append('status', 'Active')

            let urltwo = '/api/advertpayment';
            apiClient.get('/sanctum/csrf-cookie').then(()=>{
            apiClient.post(urltwo, formData, {
            headers:{
                "Authorization":"Bearer "+local.token,
                }
            }).then(res=>{
              console.log(res)
                if(res.data.success){
                  //  window.location.href = `${original}`
                   navigate('/')

                }
            })
            })


                }
                    
                })
    
        })
    
        },
        onClose: function(){
            // user closed popup
          }
    
    })
    paystack.openIframe()

  }



    return (
        <div className="w-full flex flex-col items-center justify-center  bg-white ">
         <Navbar/>
              <section className='m-auto w-11/12  flex flex-col items-center'>
               <article className='w-full  m-auto  font-medium text-center text-2xl' style={{ marginTop:"10px" }}>
               Get more from Advert plan Catetories
               </article>
                 <section className='w-full'>
                    <article className=" w-11/12 flex flex-col items-center justify-center px-2 py-2 space-x-0  sm:w-11/12 sm:flex sm:flex-col sm:items-center sm:justify-center sm:px-2 sm:py-2 sm:space-x-0  md:w-11/12 md:flex md:flex-row md:items-center md:justify-center md:px-2 md:py-2 md:space-x-6 lg:w-11/12 lg:flex lg:flex-row lg:items-center lg:justify-center lg:px-2 lg:py-2 lg:space-x-6">
                         {data.length > 0?
                         data.map((item, index)=>{
                            return<div key={index} className="w-10/12  flex flex-col items-center border-0  border-white px-2   sm:w-10/12  sm:flex sm:flex-col sm:items-center sm:border-0  sm:border-white  sm:px-2    md:w-1/3  md:flex md:flex-col md:items-center md:border-r-2  md:border-[#FF6600] md:px-2    lg:w-1/3  lg:flex lg:flex-col lg:items-center lg:border-r-2  lg:border-[#FF6600] lg:px-2">
                            <article className='w-full  h-40'>
                        <img className='w-full h-full object-cover' src={item.image}/>
                            </article>
                            <section className='w-full py-2 mt-2'>
                            <span className=' float-left w-1/5 capitalize font-extrabold'>
                                {item.name}
                                </span>
                                <span className=' float-right w-1/5 font-semibold'>
                                <CurrencyFormat  value={item.price} displayType={'text'} thousandSeparator={true} prefix={'₦'}  />
                                </span>
                            </section>
                           <article className='mt-2 text-justify font-medium '>
                           In publishing and graphic design, 
                           Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without
                            relying on meaningful content. 
                           Lorem ipsum may be used as a placeholder before final copy is available
                           </article>
                           <section className='w-full py-2 mt-2'>
                                <span className=' float-right w-1/5 font-semibold'>
                                    {item.days+'days'}
                                </span>
                            </section>
                             <section className='py-2 flex flex-row items-center justify-center'>
                                <button className='w-32 py-2 rounded-md bg-[#FF6600] text-white' onClick={()=>handleClick(item.name, item.days, item.price )}>
                                    Buy
                                </button>
                             </section>
                        </div>

                         })
                         
                         :""}




                    


                    </article>
                 </section>
              </section>

        </div>
    )
}
