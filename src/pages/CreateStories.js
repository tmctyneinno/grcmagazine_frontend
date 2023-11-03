import React,{useState, useEffect} from 'react'
import ReactQuill from 'react-quill';
import "../../node_modules/react-quill/dist/quill.snow.css";
import "../css/union.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { FaArrowAltCircleLeft } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { AES, enc } from 'crypto-js';
import { Markup } from 'interweave';
import { useNavigate } from 'react-router-dom';
let local = localStorage.getItem('userlogindetails')?JSON.parse(AES.decrypt(localStorage.getItem('userlogindetails'), 'GRCMAZAGINE').toString(enc.Utf8)):{}

export default function CreateStories() {
  const [date, Setdate] = useState("")
  const [one, Setone] = useState("")
  const [two, Settwo] = useState("")
  const [three, Setthree] = useState("")
  const [four, Setfour] = useState("")
  const [five, Setfive] = useState("")
  const [Quotation, SetQuotation] = useState("")
  const [head, Sethead] = useState("")
  const [userdata, Setuserdata] = useState(local?local:{})
  const [data, Setdata] = useState([]);
  const [picture, Setpicture] = useState([])
  const [categories, Setcategories] = useState("")
  const [message, Setmessage] = useState("")
  const [show, Setshow] = useState(false) 
  const [showx, Setshowx] = useState(true)
  const [findno, Setfindno] = useState({})
  const [isedit, Setisedit] = useState(false)
  const [editid, Seteditid] = useState('')
  const [imgx, Setimgx] = useState('')
   let {state} = useLocation();
   let enid = state?state.id:""
   const navigate = useNavigate();

  useEffect(()=>{

    if(Object.keys(local).length === 0){
      console.log('nothing')
    }else{
        if(local.usertype === "Admin" || local.usertype === "User" ){
          // console.log(userdata)
       }else{
        localStorage.clear();
        // window.location.href='/'
        navigate('/')
 
       }
    }
    
    

  
  },[])

  const apiClient = axios.create({
    baseURL: "http://api.tmcinstitute.com",
    withCredentials: true
  });
  
  useEffect(()=>{
   

    apiClient.get('/sanctum/csrf-cookie').then( ()=> {


        let url = '/api/categories/';
        apiClient.get(url, {
          headers:{
            "Authorization":"Bearer "+userdata.token,
            }
        }).then(res=>{
         if(res.data.success){
          Setdata(res.data.success)
         }
        })
  })

  if(enid){
    let ans = enid?true:false
    Setisedit(ans)
    apiClient.get('/sanctum/csrf-cookie').then( ()=> {
      let url = '/api/single/'+enid;
      apiClient.get(url).then(res=>{
         console.log(res)
         Setfindno(res.data.findno)
        //  articlename articlebodyfour articlebodyfive articlecoatbody

          Sethead(res.data.findno.articlename)
          Setone(res.data.findno.articlebodyone)
          Settwo(res.data.findno.articlebodytwo)
          Setthree(res.data.findno.articlebodythree)
          Setfour(res.data.findno.articlebodyfour)
          Setfive(res.data.findno.articlebodyfive)
          SetQuotation(res.data.findno.articlecoatbody)
          Setcategories(res.data.findno.categories)
           Setimgx(res.data.findno.picture)
        let dateup =  new Date(res.data.findno.dataup)
        Setdate(dateup);
        Seteditid(res.data.findno.id)

      })
})
  }


},[])
const handleimg =(e)=>{
  e.preventDefault()
 Setpicture(e.target.files[0])
}
const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
];

const handleClick =()=>{
  // console.log(one, two, three, head, picture, categories, four, five, Quotation, date)
if(one !== "" && two !== "" && three !== "" && head !== "" && picture !== "" && picture.length !== 0 && date !== "" && categories !== ""){
    console.log(one, two, three, head, picture, categories, four, five, Quotation, date)
    if(picture.type  === "image/png" || picture.type === "image/jpg" || picture.type === "image/jpeg"){

      let end = new Date(date)
      var enddd = String(end.getDate()).padStart(2, '0');
      var endmm =  end.getMonth(); 
      var endyyyy = end.getFullYear();
      let ansdate = months[endmm]+" "+enddd+" "+endyyyy
  
      let formData = new FormData();
      formData.append('articlename',  head)
      formData.append('articlebodyone',  one)
      formData.append('articlebodytwo',  two)
      formData.append('articlebodythree',  three)
      formData.append('articlebodyfour',  four)
      formData.append('articlebodyfive',  five)
      formData.append('articlecoatbody',  Quotation)
      formData.append('dataup',  ansdate)
      formData.append('picture',  picture)
      formData.append('categories',  categories)
      apiClient.get('/sanctum/csrf-cookie').then(()=>{
        let urltwo = '/api/createarticle';
        apiClient.post(urltwo, formData, {
          headers:{
            "Authorization":"Bearer "+userdata.token,
            }
        }).then(res=>{
          console.log(res)
              if(res.data.success){
                Setmessage(res.data.success)
                Setshow(true)
              }
     
             }).catch(err=>{
              let error = err.response.data.errors
              if(error.articlename){
                Setmessage(error.articlename[0])    
                Setshow(true)                      
               }else if(error.articlebodyone){
                 Setmessage(error.articlebodyone[0])
                 Setshow(true)

               }else if(error.articlebodytwo){
                Setmessage(error.articlebodytwo[0])
                Setshow(true)

              }else if(error.articlebodythree){
                Setmessage(error.articlebodythree[0])
                Setshow(true)

              }else if(error.articlebodyfour){
                Setmessage(error.articlebodyfour[0])
                Setshow(true)

              }else if(error.articlebodyfive){
                Setmessage(error.articlebodyfive[0])
                Setshow(true)

              }else if(error.articlecoatbody){
                Setmessage(error.articlecoatbody[0])
                Setshow(true)

              }else if(error.dataup){
                Setmessage(error.dataup[0])
                Setshow(true)

              }else if(error.picture){
                Setmessage(error.picture[0])
                Setshow(true)

              }else if(error.categories){
                Setmessage(error.categories[0])
                Setshow(true)

              }
             })
  
            })
    }else{

Setmessage('Please enter insert an image')
Setshow(true)
    }
  

}else{
  Setmessage('Please insert values')
  Setshow(true) 
}
}

const handleback =()=>{
  if(local.usertype == "Admin"){
    navigate('/admin/list')

    // window.location.href = 'http://127.0.0.1:3000/admin/list';

  }else{
    navigate('/user/profile')
    // window.location.href = 'http://127.0.0.1:3000/user/profile';

  }
}
  
const handleEdit =()=>{
  if(editid){
  let ansimgx =  Object.keys(picture).length > 0?picture:imgx
    let end = new Date(date)
    var enddd = String(end.getDate()).padStart(2, '0');
    var endmm =  end.getMonth(); 
    var endyyyy = end.getFullYear();
    let ansdate = months[endmm]+" "+enddd+" "+endyyyy
    let formData = new FormData();
    formData.append('id', editid)
    formData.append('articlename',  head)
    formData.append('articlebodyone',  one)
    formData.append('articlebodytwo',  two)
    formData.append('articlebodythree',  three)
    formData.append('articlebodyfour',  four)
    formData.append('articlebodyfive',  five)
    formData.append('articlecoatbody',  Quotation)
    formData.append('dataup',  ansdate)
    formData.append('picture',  ansimgx)
    formData.append('categories',  categories)  
    apiClient.get('/sanctum/csrf-cookie').then(()=>{
      let urltwo = '/api/editarticle';
      apiClient.post(urltwo, formData, {
        headers:{
          "Authorization":"Bearer "+userdata.token,
          }
      }).then(res=>{
        console.log(res)
            if(res.data.success){
              Setmessage(res.data.success)
              Setshow(true)
            }
    
           }).catch(err=>{
            
           })
          })

  }

}



  return (
    <div className='w-full'>
      <section className='w-full py-2 px-2'>
        <button className='bg-[#FF6600] shadow-sm rounded-md space-x-2 flex flex-row items-center p-3 mt-2' onClick={handleback}>
          <FaArrowAltCircleLeft className='text-white text-lg'/>
          <span className='capitalize text-white '>back</span>
        </button>
      </section>
         <div className='w-11/12'>
            <section className='w-full'>

                <div className='w-11/12 sm:w-10/12 md:w-3/5 lg:w-3/5 flex flex-col items-center m-auto py-2'>
                  <span className='w-full text-left font-semibold text-lg capitalize text-black px-2 flex flex-row'>
                     
                    <h2 className=' font-semibold'>heading</h2>  
                    <h3 className='text-red-500'>*</h3>
                  </span>
                  <div className='w-full rounded-md'>
                    <input type="text" value={head}  onChange={(e)=>Sethead(e.target.value)} className="w-full rounded py-3 p-3 border outline-0 ..."/>
                  </div>
                </div>


                <div className='w-11/12 sm:w-10/12 md:w-3/5 lg:w-3/5 flex flex-col items-center m-auto py-2'>
                  <span className='w-full text-left font-semibold text-lg capitalize text-black px-2 flex flex-row'>
                   <h2 className=' font-semibold'>Paragraph One</h2>  
                    <h3 className='text-red-500'>*</h3>
                  </span>
                  <div className='w-full rounded-m  '>
                  <ReactQuill
                modules={CreateStories.modules}
                formats={CreateStories.formats}
                className=" px-2  mt-2   h-18"
                onChange={(e)=>Setone(e)}
                value={one}
                id="requirements"
                name="requirements"
                placeholder="write the first paragraph..."/>
                  </div>
                </div>

                <div className='w-11/12 sm:w-10/12 md:w-3/5 lg:w-3/5 flex flex-col items-center m-auto py-2'>
                  <span className='w-full text-left font-semibold text-lg capitalize text-black px-2 flex flex-row'>
                    <h2 className=' font-semibold'>Paragraph Two</h2>  
                    <h3 className='text-red-500'>*</h3>
                  </span>
                  <div className='w-full rounded-m  '>
                  <ReactQuill
                modules={CreateStories.modules}
                formats={CreateStories.formats}
                className=" px-2  mt-2   h-18"
                onChange={(e)=>Settwo(e)}
                value={two}
                id="requirements"
                name="requirements"
                placeholder="write the second paragraph..."/>
                  </div>
                </div>


                  
                <div className='w-11/12 sm:w-10/12 md:w-3/5 lg:w-3/5 flex flex-col items-center m-auto py-2'>
                  <span className='w-full text-left font-semibold text-lg capitalize text-black px-2 flex flex-row'>
                    <h2 className=' font-semibold'>Paragraph Three</h2>  
                    <h3 className='text-red-500'>*</h3>
                  </span>
                  <div className='w-full rounded-m  '>
                  <ReactQuill
                modules={CreateStories.modules}
                formats={CreateStories.formats}
                className=" px-2  mt-2   h-18"
                onChange={(e)=>Setthree(e)}
                value={three}
                id="requirements"
                name="requirements"
                placeholder="write the thrid paragraph..."/>
                  </div>
                </div>


                <div className='w-11/12 sm:w-10/12 md:w-3/5 lg:w-3/5 flex flex-col items-center m-auto py-2'>
                  <span className='w-full text-left font-semibold text-lg capitalize text-black px-2'>
                    Paragraph Four
                  </span>
                  <div className='w-full rounded-m  '>
                  <ReactQuill
                modules={CreateStories.modules}
                formats={CreateStories.formats}
                className=" px-2  mt-2   h-18"
                onChange={(e)=>Setfour(e)}
                value={four}
                id="requirements"
                name="requirements"
                placeholder="write the four paragraph.."/>
                  </div>
                </div>


                <div className='w-11/12 sm:w-10/12 md:w-3/5 lg:w-3/5 flex flex-col items-center m-auto py-2'>
                  <span className='w-full text-left font-semibold text-lg capitalize text-black px-2'>
                    Paragraph Five
                  </span>
                  <div className='w-full rounded-m  '>
                  <ReactQuill
                modules={CreateStories.modules}
                formats={CreateStories.formats}
                className=" px-2  mt-2   h-18"
                onChange={(e)=>Setfive(e)}
                value={five}
                id="requirements"
                name="requirements"
                placeholder="write the five paragraph..."/>
                  </div>
                </div>

                <div className='w-11/12 sm:w-10/12 md:w-3/5 lg:w-3/5 flex flex-col items-center m-auto py-2'>
                  <span className='w-full text-left font-semibold text-lg capitalize text-black px-2'>
                  Quotation 
                  </span>
                  <div className='w-full rounded-m  '>
                  <ReactQuill
                modules={CreateStories.modules}
                formats={CreateStories.formats}
                className=" px-2  mt-2   h-18"
                onChange={(e)=>SetQuotation(e)}
                value={Quotation}
                id="requirements"
                name="requirements"
                placeholder=' "write your quotation" '/>
                  </div>
                </div>
                     

                <div className='w-11/12 sm:w-10/12 md:w-3/5 lg:w-3/5 flex flex-col items-center m-auto py-2'>
                  <span className='w-full text-left font-semibold text-lg capitalize text-black px-2 flex flex-row'>
              
                  <h2 className=' font-semibold'>Picture</h2>  
                    <h3 className='text-red-500'>*</h3>
                  </span>
                  <div className='w-full rounded-md  '>
                      <input type="file" onChange={(e)=>handleimg(e)}   className="w-full" />
                   </div>
                </div>


                
                <div className='w-11/12 sm:w-10/12 md:w-3/5 lg:w-3/5 flex flex-col items-center m-auto py-2'>
                  <span className='w-full text-left font-semibold text-lg capitalize text-black px-2 flex flex-row'>
              
                  <h2 className=' font-semibold'>date created</h2>  
                    <h3 className='text-red-500'>*</h3>
                  </span>
                  <div className='w-full rounded-md '>
                         
                  <DatePicker selected={date}  onChange={(date)=>Setdate(date)}   name="from"    dateFormat="dd/MM/yyyy"  maxDate={new Date()}   yearDropdownItemNumber={100} scrollableYearDropdown={true} showYearDropdown showMonthDropdown   placeholderText="DD/MM/YYY"  className="w-full p-3 py-2 rounded border" required/>
                  </div>
                </div>



                <div className='w-11/12 sm:w-10/12 md:w-3/5 lg:w-3/5 flex flex-col items-center m-auto py-2'>
                  <span className='w-full text-left font-semibold text-lg capitalize text-black px-2 flex flex-row'>
              
                  <h2 className=' font-semibold'>categories</h2>  
                    <h3 className='text-red-500'>*</h3>
                  </span>
                  <div className='w-full p-3 py-2 rounded border '>
                      <select className="w-full p-3 py-2 rounded border" onChange={(e)=>Setcategories(e.target.value)}  value={categories}>
                        {data.map((item, index)=><option key={index}>{item.categories}</option>)}
                        
                        </select>   
                  </div>
                </div>


                <div className='w-11/12 sm:w-10/12 md:w-3/5 lg:w-3/5 flex flex-col items-center m-auto py-2'>
                  {isedit?
                            <button className='w-full text-2xl text-white bg-blue-600 rounded-md ' onClick={handleEdit}>
                            Edit
                   </button>
                  :
                  
                  <button className='w-full text-2xl text-white bg-blue-600 rounded-md ' onClick={handleClick}>
                  submit
         </button>
                  }

                </div>

            </section>
         </div>
         
         <article className={show?"bg-cover top-0 left-0 right-0 bottom-0 bg-black bg-opacity-10 bg-op fixed z-10 flex flex-row items-center  justify-center  overflow-y-scroll py-4":'hidden z-0'}>
              

                       <div className={message === 'your have created an article' || message === 'your have edited your article'?"w-10/12 sm:w-3/4 md:w-1/3 lg:w-1/3 rounded-md bg-white  text-green-600 py-2 px-2  text-2xl h-60 " :"w-10/12 sm:w-3/4 md:w-1/3 lg:w-1/3 rounded-md bg-white py-2 px-2 flex flex-col  text-red-600 text-2xl h-60"} >
                       <section className='w-full'>
              <aside className=' float-right flex flex-row items-center justify-center py-2 '>
                  <button className='w-6 h-6  rounded-full bg-white text-blue-500 grid place-content-center text-sm font-extrabold' onClick={()=>Setshow(false)}>x</button>
              </aside>
            </section> 
                  <div className="w-full grid place-content-center text-center">
                    <span className="mt-9">{message?message:'djhdvjhvdvhg'}</span>
                    
                    
                    </div>          
                       </div>
         </article>




    </div>
  )
}

CreateStories.modules = {
    toolbar:[
  [{header:"1"}, {header:"2"}, {header:[3, 4, 5, 6]}, {font:[]}],
  [{size:[]}],
  ["bold", "italic", "underline", "strike", "blockquote"],
  [{list:"ordered"},{list:"bullet"}],
  // ["link", "image", "video"],
  ["clean"],
  // ["code-block"]
  ],
  };

  CreateStories.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  // "link",
  // "image",
  // "video",
  // "code-block",
  ]
