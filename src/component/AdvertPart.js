import React,{useState} from 'react'
import Carousel from "react-elastic-carousel";
import '../css/elastic.css';
export default function AdvertPart(props) {
   let isnotnormalads = props.isnotnormalads
    const breakPoints = [
        { width: 1, itemsToShow: 1 },
        { width: 550, itemsToShow: 2, itemsToScroll: 2 },
        { width: 768, itemsToShow: 3 },
        { width: 1200, itemsToShow: 4 }
      ];
//       [
//         ' https://res.cloudinary.com/the-morgans-consortium/image/upload/v1679383341/testimages/lukas-blazek-mcSDtbWXUZU-unsplash_v1fyii.jpg',
//  'https://res.cloudinary.com/the-morgans-consortium/image/upload/v1679383330/testimages/kenny-eliason-1-aA2Fadydc-unsplash_w1nrqt.jpg',
//  'https://res.cloudinary.com/the-morgans-consortium/image/upload/v1679383330/testimages/dan-burton-wHsOV75Xi8Y-unsplash_ygfrbu.jpg',
//   'https://res.cloudinary.com/the-morgans-consortium/image/upload/v1679383329/testimages/alexandr-bormotin-ntmu8vCwQE0-unsplash_yo1c1f.jpg',
//  'https://res.cloudinary.com/the-morgans-consortium/image/upload/v1679383328/testimages/vardan-papikyan-tr0rrfiMg1o-unsplash_l55ked.jpg',
//  'https://res.cloudinary.com/the-morgans-consortium/image/upload/v1679383329/testimages/clay-banks-31l-8hY1mt4-unsplash_sm0ci4.jpg'
//        ]
      const [items, setItems] = useState(isnotnormalads.length > 0?isnotnormalads:[]);
   
    return (
        <div className="carousel-wrapper m-auto ">
            <Carousel
          enableAutoPlay autoPlaySpeed={3500}
            breakPoints={breakPoints} 
            >
 

                {items.map((item, index)=>{

                    return <div key={index}
                    style={{    display:'flex',
         flexDirection:"column",
          justifyContent:'center',
          alignItems:"center",
          height:"250px",
          width:"100%",
          backgroundColor:"white",
          color:"black",
          borderRadius:"2px 2px",
          boxShadow:"2px 4px 6px rgba(0, 0, 0, 0.5)",
          margin:"15px",
          fontSize:"4em",
          position:"relative",
          }}>

                        
                    <img src={item.image} className="w-full h-full"  />
                        <section className="absolute top-0 bottom-0 z-10 text-white text-2xl bg-cover bg-black bg-opacity-10 w-full grid place-content-center">
                             {item.companyname}  
                        </section>
                    </div>
                })}



            </Carousel>
            
        </div>
    )
}
