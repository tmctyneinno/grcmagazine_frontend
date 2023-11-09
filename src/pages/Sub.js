import React,{useEffect, useState} from 'react';
import Navbar from '../component/Navbar';
import '../css/sub.css';
import axios from 'axios';
import { AES, enc } from 'crypto-js';
import PaystackPop from '@paystack/inline-js';
import CurrencyFormat from 'react-currency-format';
import { useNavigate } from 'react-router-dom';
let local = localStorage.getItem('userlogindetails')?JSON.parse(AES.decrypt(localStorage.getItem('userlogindetails'), 'GRCMAZAGINE').toString(enc.Utf8)):{}

export default function Sub() {
   let original = 'http://api.grcfincrimetoday.org';
   const [data, Setdata] = useState([]);
   const [userdata, Setuserdata] = useState(local?local:{})
   const [infodata, Setinfodata] = useState(null)
   const [islogin, Setislogin] = useState(false)
   const apiClient = axios.create({
      baseURL: "http://api.grcfincrimetoday.org",
      withCredentials: true
    });

    const navigate = useNavigate();

    useEffect(()=>{
      apiClient.get('/sanctum/csrf-cookie').then( ()=> {
         let url = '/api/getsubscription';
         apiClient.get(url,{
           headers:{
             "Authorization":"Bearer "+userdata.token,
             }
         }).then(res=>{
           if(res.data.success){
             let data = res.data.success;
           let son =  data.sort((a, b)=>a.number_of_article - b.number_of_article)
          Setdata(son)
           }          
   
         })
   })




   apiClient.get('/sanctum/csrf-cookie').then( ()=> {
      let url = '/api/getpayment/'+local.id;
      apiClient.get(url,{
        headers:{
          "Authorization":"Bearer "+userdata.token,
          }
      }).then(res=>{
         console.log(res)
        if(res.data.success){
         Setinfodata(res.data.success)


        }          

      })
})


if(Object.keys(local).length === 0){
  Setislogin(false)
}else{
    if(local.usertype === "User" ){
      // console.log(userdata)
      Setislogin(true)
   }else{
    Setislogin(false)
    
   }
}
 
    },[])


    const handlePayment =(price, name, days, number_of_article)=>{
      let paystack = PaystackPop.setup({
         key: 'pk_test_717211460dbb54580490c8c657c4b42e4e35da03',
         email: local.email,
         amount: parseInt(price) * 100,
      
         callback: function(response){
            let ref = response.reference
            
          apiClient.get('/sanctum/csrf-cookie').then( ()=> {
           let hypelink = `${original}/api/paystack_verify/${ref}`
          apiClient.get(hypelink,{
              headers:{
                "Authorization":"Bearer "+userdata.token,
                }
            }).then(res=>{
              if(res.data.success){
                let data = JSON.parse(res.data.success);
                //res.data.message
                //price
                //
             

                let formData = new FormData();
                formData.append('plan_name', name)
                formData.append('price',  price)
                formData.append('code',  ref)
                formData.append('message',  data.message)
                formData.append('user_id',  local.id)
                formData.append('days',  days)
                formData.append('number_of_article',  number_of_article)

                apiClient.get('/sanctum/csrf-cookie').then(()=>{
                  let urltwo = '/api/payment_sub';
                  apiClient.post(urltwo, formData, {
                    headers:{
                      "Authorization":"Bearer "+userdata.token,
                      }
                  }).then(res=>{
                     console.log(res)

                     if(res.data.data && res.data.success){
                      Setinfodata(res.data.data)

                     }
                  }).catch(err=>{
            
                  })
            
               })          




   
              }          
      
            })
      })


           

         },
         onClose: function(){
           // user closed popup
         }
       });
       
       paystack.openIframe()
    }

const handleLogin =()=>{
  if(islogin == false){
    navigate(`/user/login`)
    // window.location.href=`${original}/user/login`;
  }
}


    return (
        <div className="w-full">
            <Navbar/>
           <section className='w-full bg-white py-4 h-fit grid grid-cols-1 gap-4  place-items-center   sm:w-full sm:bg-white sm:py-4 sm:h-fit sm:grid sm:grid-cols-1 sm:gap-4  sm:place-items-center    md:w-full md:bg-white md:py-4 md:h-fit md:grid md:grid-cols-2 md:gap-4  md:place-items-center  lg:w-full lg:bg-white lg:py-4 lg:h-fit lg:flex lg:flex-col lg:items-center'>
                      <div className="w-2/3 m-auto text-center text-2xl font-semibold capitalize text-[#FF6600]">
                        Your Three Days Free Trial has expired
                      </div>
                  <div className="w-full  grid grid-cols-3 gap-4  place-items-center">
                        
                  {data.map((item, index)=>{
                        return      <div key={index} className='w-60 sm:w-60 md:w-80 lg:w-80 box-shadow bg-[#FF6600] rounded-md flex flex-col items-center py-2 px-2 '>
                        <div className='w-10/12 flex flex-col items-center justify-center'>
                           <span className='text-sm font-normal text-white text-center capitalize mt-2'>{item.name}</span>
                           <span className="text-lg text-center capitalize text-white mt-2">
                            <CurrencyFormat  value={item.price} displayType={'text'} thousandSeparator={true} prefix={'₦'}  />
                            </span>
                        </div>
                        <div className='w-full px-2 flex flex-row items-center text-base text-center mt-1 py-2 text-white'>
                         {item.bodys}
                        </div>
 
                        
                        <section className='w-full py-2 flex flex-row items-center justify-center'>
                           { islogin == true? infodata != null? 
                              <button className='bg-white px-10 py-2 text-center capitalize rounded-md text-[#FF6600]' onClick={()=>handlePayment(item.price, item.name, item.days, item.number_of_article)}>
                              {infodata != null?infodata.plan_name === item.name? "Purchased":"Buy":"Buy"}   
                            </button>
                           :
                           <button className='bg-white px-10 py-2 text-center capitalize rounded-md text-[#FF6600]' onClick={()=>handlePayment(item.price, item.name, item.days, item.number_of_article)}>
                           {infodata != null?infodata.plan_name === item.name? "Purchased":"Buy":"Buy"}   
                         </button>
                           :
                           <button className='bg-white px-10 py-2 text-center capitalize rounded-md text-[#FF6600]' onClick={()=>handleLogin()}>
                          Buy  
                         </button>
                           }
                        
                           
                       
                        </section>
 
                        <div className="w-full  small  mt-2">
                          <span className='w-20 text-base text-center capitalize text-white'>days:{item.days}</span>
                          <span className='w-20 text-base text-center capitalize text-white'>articles:{item.number_of_article}</span>
                        </div>
                 </div> 
                      })}
                    
                  </div>

                   


{/* 
              <div className='w-60 sm:w-60 md:w-80 lg:w-80 box-shadow bg-[#FF6600] rounded-md flex flex-col items-center py-2 px-2 '>
                       <div className='w-10/12 flex flex-col items-center justify-center'>
                          <span className='text-sm font-normal text-white text-center capitalize mt-2'>name of plan</span>
                          <span className="text-lg text-center capitalize text-white mt-2">10,000</span>
                       </div>
                       <div className='w-full px-2 flex flex-row items-center text-base text-center mt-1 py-2 text-white'>
                        Lorem djhdjhjd ddidhjdkjbjd dkkidjhjkdjhhjd dihdjd hjewjhwhjwe wejhhjwehjew weh
                        weu ewgghewghew weghhgewvh
                       </div>

                       
                       <section className='w-full py-2 flex flex-row items-center justify-center'>
                          <button className='bg-white px-10 py-2 text-center capitalize rounded-md text-[#FF6600]'>
                             buy
                          </button>
                       </section>

                       <div className="w-full  small  mt-2">
                         <span className='w-20 text-base text-center capitalize text-white'>day:20</span>
                         <span className='w-20 text-base text-center capitalize text-white'>articles:10</span>
                       </div>
                </div>  */}


             


         

           </section>
        </div>
    )
}
