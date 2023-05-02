import React,{useState, useEffect} from 'react';
import Navbar from '../component/Navbar';
import '../css/subscription.css';
import { AES, enc } from 'crypto-js';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
let local = localStorage.getItem('userlogindetails')?JSON.parse(AES.decrypt(localStorage.getItem('userlogindetails'), 'GRCMAZAGINE').toString(enc.Utf8)):{}
export default function CreateSubscribe() {
    const [show, Setshow] = useState(false);
    const [userdata, Setuserdata] = useState(local?local:{})
    const [name, Setname] = useState('');
    const [price, Setprice] = useState('');
    const [days, Setdays] = useState('');
    const [articles, Setarticles] = useState('');
    const [bodys, Setbodys] = useState('');
    const [data, Setdata] = useState([]);
    const [isedit, Setisedit] = useState(false)
    const [isview, Setisview] = useState(false)
    const [isid, Setisid] =  useState("")
    const [message, Setmessage] = useState("");
    let originurl = window.location.origin;
    const apiClient = axios.create({
      baseURL: "http://127.0.0.1:8000",
      withCredentials: true
    });

    const navigate = useNavigate();

     useEffect(()=>{
      if(Object.keys(local).length === 0){
        window.location.href = `${originurl}/`
        navigate('/')

      }else{
          if(local.usertype === "Admin" ){
       
         }else{
          // window.location.href = `${originurl}/`
          navigate('/')
        }
      } 


      apiClient.get('/sanctum/csrf-cookie').then( ()=> {
        let url = '/api/getsubscription';
        apiClient.get(url,{
          headers:{
            "Authorization":"Bearer "+userdata.token,
            }
        }).then(res=>{
          if(res.data.success){
            let data = res.data.success;

         Setdata(res.data.success)
          }          
  
        })
  })

  // getSubscription

     },[])


      const handleSubmit =()=>{
      if(data.length === 0){
     let objans =   { id:1, name:name, price:price, days:days, number_of_article:articles, bodys:bodys}
     let answerarr =  [...data, objans]
        Setdata(answerarr);
        let formData = new FormData();
        formData.append('name', name)
        formData.append('price',  price)
        formData.append('days',  days)
        formData.append('article',  articles)
        formData.append('bodys',  bodys)
        apiClient.get('/sanctum/csrf-cookie').then(()=>{
          let urltwo = '/api/addsubscription';
          apiClient.post(urltwo, formData, {
            headers:{
              "Authorization":"Bearer "+userdata.token,
              }
          }).then(res=>{
            console.log(res)
                if(res.data.success){
                  Setdata(res.data.data)
                  // Setmessage(res.data.success)
                   Setshow(false)
                  Setname('')
                  Setprice('')
                  Setdays('')
                  Setarticles('')
                  Setbodys('')
                }
        
               }).catch(err=>{
                let error = err.response.data.errors
                if(error.name){
                  Setmessage(error.name[0]) 
                }else if(error.price){
                  Setmessage(error.price[0]) 
                }else if(error.days){
                  Setmessage(error.days[0]) 
                }else if(error.articles){
                  Setmessage(error.articles[0]) 
                }else if(error.bodys){
                  Setmessage(error.bodys[0]) 
                }
               })
              })
      }else{
            let ansdata =   data.map((item)=>item.name == name || item.price == price || item.days == days || item.number_of_article == articles || item.bodys == bodys) 
            let answer = ansdata.includes(true);
            if(answer == true){
                 console.log('you cant insert the same value twice')
            }else{
               let ansnum = data.length + 1;
                let objans =   { id:ansnum, name:name, price:price, days:days, number_of_article:articles, bodys:bodys}
                let answerarr =  [...data, objans]
                   Setdata(answerarr);
                

                    let formData = new FormData();
                    formData.append('name', name)
                    formData.append('price',  price)
                    formData.append('days',  days)
                    formData.append('article',  articles)
                    formData.append('bodys',  bodys)
                    apiClient.get('/sanctum/csrf-cookie').then(()=>{
                      let urltwo = '/api/addsubscription';
                      apiClient.post(urltwo, formData, {
                        headers:{
                          "Authorization":"Bearer "+userdata.token,
                          }
                      }).then(res=>{
                        console.log(res)
                            if(res.data.success){
                              // Setmessage(res.data.success)
                              Setshow(false)
                              Setname('')
                              Setprice('')
                              Setdays('')
                              Setarticles('')
                              Setbodys('')
                            }
                    
                           }).catch(err=>{
                            let error = err.response.data.errors
                            if(error.name){
                              Setmessage(error.name[0]) 
                            }else if(error.price){
                              Setmessage(error.price[0]) 
                            }else if(error.days){
                              Setmessage(error.days[0]) 
                            }else if(error.articles){
                              Setmessage(error.articles[0]) 
                            }else if(error.bodys){
                              Setmessage(error.bodys[0]) 
                            }
                           })
                          })
            }

      }
      }
    //   console.log(data)  
    const handleDel =(id)=>{
    console.log(id)
    let ans =  data.filter((item)=>item.id !== id)
    Setdata(ans)
    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer "+userdata.token);
    myHeaders.append("Content-Type", "application/json");
    
    var raw = JSON.stringify({
      'id':id
    });
    
    var requestOptions = {
      method:'DELETE',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
     apiClient.get('/sanctum/csrf-cookie').then( ()=> { 
      let url = 'http://127.0.0.1:8000/api/deletesubscription';
        fetch(url, requestOptions)
        .then(response => response.json())
        .then(result =>{
          console.log(result)
             if(result.success){
              Setdata(result.data);

             }
        })
     })

    }


  

    const handleView =(id)=>{
        let ans =  data.filter((item)=>item.id == id)
        // console.log(ans)
        Setshow(true)
        Setisview(true)
        Setisedit(false)
        // Setsingledata(ans)
        Setname(ans.length > 0?ans[0].names:'')
        Setprice(ans.length > 0?ans[0].price:'')
        Setdays(ans.length > 0?ans[0].days:'')
        Setarticles(ans.length > 0?ans[0].articles:'')
        Setbodys(ans.length > 0?ans[0].bodys:'')
    }

    const handleEdit =(id)=>{
        let ans =  data.filter((item)=>item.id == id)
        Setisid(id)
        Setshow(true)
        Setisedit(true)
        Setname(ans.length > 0?ans[0].name:'')
        Setprice(ans.length > 0?ans[0].price:'')
        Setdays(ans.length > 0?ans[0].days:'')
        Setarticles(ans.length > 0?ans[0].number_of_article:'')
        Setbodys(ans.length > 0?ans[0].bodys:'')
    }

    const handleEditx =()=>{
        if(isid != ""){
       
              data.map((item)=>{
                return item.id === isid?{...item, name:name, price:price, days:days, number_of_article:articles, bodys:bodys}:item
                })
                Setshow(false)
              Setisedit(false)

              let myHeaders = new Headers();
              myHeaders.append("Authorization", "Bearer "+userdata.token);
              myHeaders.append("Content-Type", "application/json");
              
             
              var raw = JSON.stringify({
                'id':isid,
               "name":name,
               "price":price,
               "days":days,
               "article":articles,
               'bodys':bodys
              });
              
              var requestOptions = {
                method:'PUT',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
              };
              
               apiClient.get('/sanctum/csrf-cookie').then( ()=> { 
                let url = 'http://127.0.0.1:8000/api/editsubscription';
                  fetch(url, requestOptions)
                  .then(response => response.json())
                  .then(result =>{
                    console.log(result)
                    if(result.success){                     
                       Setdata(result.data);
                    }
                  })
                  .catch(error => console.log(error)
                  ) });


            }
    }


  // const handleDelete = ()=>{
 
  // }

  const handleopen = ()=>{
    Setshow(true)
     Setname("")
     Setprice("") 
     Setdays("") 
     Setarticles("") 
     Setbodys("")
     Setisedit(false)

  }

    return (
        <div  className="w-full ">
            <Navbar/>
                     
         
            <div className="w-full flex flex-col justify-center items-center bg-white">
            <div className='w-full'>
                    <section className="w-1/5 float-right grid place-content-center py-2">
                       <button className="capitalize text-center  rounded-md text-white bg-[#FF6600] py-2 px-2" onClick={handleopen}>
                        create subscription
                       </button>
                    </section>
                </div>
              
                <section className='w-11/12 sm:w-11/12 md:w-3/4 lg:w-3/4 m-auto rounded-md border px-2 py-2 border-black overflow-auto sm:overflow-auto md:overflow-auto lg:overflow-hidden'>
                        <table className='w-full '>
                            <thead>
                            <tr>
                            <th className=' capitalize text-black text-center text-lg font-semibold py-2 border-b-2 border-black'>
                                    Number
                                </th>
                                <th className=' capitalize text-black text-center text-lg font-semibold py-2 border-b-2 border-black'>
                                    Name
                                </th>
                                <th className=' capitalize text-black text-center text-lg font-semibold py-2 border-b-2 border-black'>
                                 Price
                                </th>
                                <th className=' capitalize text-black text-center text-lg font-semibold py-2 border-b-2 border-black'>Days</th>
                                <th className=' capitalize text-black text-center text-lg font-semibold py-2 border-b-2  border-black'>article</th>
                                <th className=' capitalize text-black text-center text-lg font-semibold py-2 border-b-2 border-black'>action</th>
                            </tr>
                            </thead>
                            <tbody>

                                {data.map((item, index)=>{
                                    return <tr key={index}>
                                    <td className=" text-base text-black capitalize text-center py-2 "> {index + 1} </td>
                                        <td className=" text-base text-black capitalize text-center py-2  "> {item.name} </td>
                                    <td className="  text-base text-black capitalize text-center py-2  "> {item.price} </td>
                                        <td className="  text-base text-black capitalize text-center py-2  "> {item.days} </td>
                                        <td className="  text-base text-black capitalize text-center py-  ">  {item.number_of_article} </td>
                                        <td className="  text-base text-black capitalize text-center py-2  grid grid-cols-1 gap-2  sm:grid sm:grid-cols-1 sm:gap-2  md:grid md:grid-cols-2 md:gap-2  lg:grid lg:grid-cols-2 lg:gap-2  "> 
                                           <button className='text-center rounded-md bg-[#FF6600] px-4 text-white' onClick={()=>handleView(item.id)}>view</button>
                                           <button className='text-center rounded-md bg-red-500 px-4 text-white' onClick={()=>handleDel(item.id)}>delete</button>
                                           <button className='text-center rounded-md bg-green-500 px-4 text-white' onClick={()=>handleEdit(item.id)}>Edit</button>

                                         </td>
    
                                    </tr>
                                })}
                               

                                {/* <tr>
                                <td className=" text-base text-black capitalize text-center py-2"> 2 </td>
                                    <td className=" text-base text-black capitalize text-center py-2"> djhdjhd </td>
                                    <td className="  text-base text-black capitalize text-center py-2"> sjhjhs </td>
                                    <td className="  text-base text-black capitalize text-center py-2"> sjjsh </td>
                                    <td className="  text-base text-black capitalize text-center py-2">  duyugd </td>
                                    <td className="  text-base text-black capitalize text-center py-2 flex flex-row items-center justify-center space-x-2"> 
                                    <button className='text-center rounded-md bg-[#FF6600] px-4 text-white'>view</button>
                                    <button className='text-center rounded-md bg-red-500 px-4 text-white'>delete</button>
                                     </td>

                                </tr> */}
                            </tbody>
                           
                        </table>
                   
                </section>

           
            </div>

            <article className={show?"bg-cover top-0 left-0 right-0 bottom-0 bg-black bg-opacity-10  fixed z-10 flex flex-row items-center  justify-center  overflow-y-scroll py-4":'hidden z-0'}>
                <section className="w-11/12 sm:w-11/12 md:w-10/12 lg:w-10/12 rounded-md bg-white flex flex-col items-center  justify-center py-2">
                    <article className="w-full">
                              <div className="w-1/12 float-right grid place-content-center mt-2">
                                   <button onClick={()=>Setshow(false)} className="w-6 h-6 text-center bg-[#FF6600] text-white rounded-full">
                                    x
                                   </button>
                              </div>
                    </article>
                      <article className="w-full flex flex-col items-center  justify-center">
                         
                         <section className='w-11/12 flex flex-col items-center  sm:w-11/12 sm:flex sm:flex-col sm:items-center md:w-11/12 md:flex md:flex-row md:items-center  lg:w-11/12 lg:flex lg:flex-row lg:items-center space-x-2'>
                          <div className="w-full sm:w-full md:w-1/2 lg:w-1/2 flex flex-col items-center">
                           <section className='w-full text-left text-base text-black '>
                             Name
                           </section>
                           <article className='w-full'>
                            <input type="text" value={name} onChange={(e)=>Setname(e.target.value)} className="w-full" />
                           </article>
                          </div>


                          <div className="w-full sm:w-full md:w-1/2 lg:w-1/2 flex flex-col items-center">
                           <section className='w-full text-left text-base text-black '>
                             Price
                           </section>
                           <article className='w-full  rounded-md'>
                            <input type="number" value={price} onChange={(e)=>Setprice(e.target.value)} className="w-full" />
                           </article>
                          </div>

                         </section>



                         <section className='w-11/12 flex flex-col mt-2 items-center  sm:w-11/12 sm:flex sm:mt-2 sm:flex-col sm:items-center md:w-11/12 md:flex md:mt-2 md:flex-row md:items-center  lg:w-11/12 lg:mt-2 lg:flex lg:flex-row lg:items-center space-x-2'>
                          <div className="w-full sm:w-full md:w-1/2 lg:w-1/2 flex flex-col items-center">
                           <section className='w-full text-left text-base text-black '>
                             Days
                           </section>
                           <article className='w-full mt-3 rounded-md'>
                            <input type="number" value={days} onChange={(e)=>Setdays(e.target.value)} className="w-full" />
                           </article>
                          </div>


                          <div className="w-full sm:w-full md:w-1/2 lg:w-1/2 flex flex-col items-center">
                           <section className='w-full text-left text-base text-black '>
                             Number of Article
                           </section>
                           <article className='w-full mt-3 rounded-md'>
                            <input type="number" value={articles} onChange={(e)=>Setarticles(e.target.value)} className="w-full" />
                           </article>
                          </div>

                         </section>

                         <section className='w-11/12 flex flex-col items-center space-x-2 mt-4'>
                         <section className='w-full text-left text-base text-black '>
                             Body
                           </section>
                             <article className='w-full '>
                                <textarea value={bodys} onChange={(e)=>Setbodys(e.target.value)} className='w-full h-28 sm:h-32 md:h-52 lg:h-52 border outline-0'></textarea>
                             </article>
                          </section>

                          <section className='w-11/12 flex flex-col items-center space-x-2 mt-2'>
                            {/* isedit?<button className='text-center bg-green-500 w-1/3 py-2 rounded-md text-white' onClick={handleEditx}>
                                Edit
                            </button> */}
                         {isedit?<button className='text-center bg-green-500 w-1/3 py-2 rounded-md text-white' onClick={handleEditx}>
                                Edit
                            </button>:isview?"": <button className='text-center bg-[#FF6600] w-1/3 py-2 rounded-md text-white' onClick={handleSubmit}>
                                Submit
                            </button> }

                           
                       </section>
                      </article>
                </section>
        </article>
        </div>
    )
}
