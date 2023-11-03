import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Email() {
    const [show, Setshow] = useState(false);
    let {email, code} = useParams()

    const apiClient = axios.create({
        baseURL: "http://api.tmcinstitute.com",
        withCredentials: true
      });

      const navigate = useNavigate();
 
    useEffect(()=>{
        apiClient.get('/sanctum/csrf-cookie').then( ()=> {
            let url = `/api/activate/${email}/${code}`;
            apiClient.get(url).then(res=>{
                console.log(res)
                 if(res.data.success){
                    Setshow(true)
                 }else if(res.data.error){
                    Setshow(true)
                 }
            
            })
        })

    },[])

      const handleSign =()=>{
        navigate('/user/login')

        // window.location.href = `http://localhost:3000/user/login`;
      }
  return (
    <div className="w-full grid place-items-center">
     
    <section className="flex items-center justify-center mt-2 px-3 py-3 space-x-2">
        <div className="w-1/2">
            <img src="https://res.cloudinary.com/the-morgans-consortium/image/upload/v1675167894/Grc%20magazine/2846317_a4xzrp.jpg" className=""/>
        </div>
        <article className="w-1/2 flex flex-col jus items-center justify-center">
            <span className="text-4xl mt-3 w-full text-center capitalize font-extrabold text-black">email confirmation</span>
            <span className="text-2xl w-3/5 mt-2 font-medium">
                Maybe Bigfoot has broken this page
                Come back to the homepage
            </span>
            <span className="flex space-x-6 items-center mt-3">
              {show? 
            <button className=" border border-purple-500 flex flex-row items-center py-3 px-3 rounded bg-[#FF6600] text-white" onClick={handleSign}>
              Sign-in
            </button>:
                   <button className=" border border-purple-500 flex flex-row items-center py-3 px-3 rounded bg-[#FF6600] text-white">
                   loading
                 <img src='https://res.cloudinary.com/the-morgans-consortium/image/upload/v1675169049/Grc%20magazine/Gear-0.2s-200px_plffaq.gif'  className='h-6 w-6' />                
                 </button>
              
              }  
       
            </span>
        </article>
    </section>

</div>
  )
}
