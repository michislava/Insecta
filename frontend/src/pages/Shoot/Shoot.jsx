
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect, useCallback } from "react"
import classes from "./shoot.module.css"

function ViewCard({card}){
  const navigate = useNavigate();

  return <div className={classes.successWrapper}>
    <img src={card.image}/>
    <h1>
      {card.name}
    </h1>
    <h4>
      {card.description}
    </h4>
    <button onClick={() => navigate("/deck")} >Go to deck</button>
  </div>
}


export default function ShootPage() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [photo, setPhoto] = useState(null)
  const [step, setStep] = useState('VIDEO')
  const [card ,setCard] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  // @TODO handle deny
  useEffect(()=>{navigator.permissions.query({ name: 'camera' })},[])
  useEffect(() => {
    if(step === 'VIDEO'){
      navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", aspectRatio: 9 / 16 }
      })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      })
      .catch(console.error)
    }
  }, [step])

  const takePhoto = useCallback(() => {
    if(step!=='VIDEO') return 
    console.log(step)
    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    setPhoto(canvas.toDataURL("image/png"))
    setStep('PICTURE')
  },[step])

  const submitToBe = useCallback(async ()=>{
    if(step!=='PICTURE') return
    // @TODO use backend
    setIsUploading(true)
    const fetchedCard = await new Promise(r=>setTimeout(()=>r({image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyCBIX5o1Af_JDI2rn56RFiuv90AcMmJAPpg&s',name:'Ladyius buggiuos', description:'Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.'}),1000)).finally()
    setCard(fetchedCard)
    setStep('VIEW')
  },[step])

  return (
    <>
    <div className={classes.wrapper}>
      {step==='VIDEO' && <>
      <video className={classes.video} ref={videoRef} autoPlay playsInline  />
      <canvas ref={canvasRef} style={{ display: "none" }} />
        <svg onClick={takePhoto} className={classes.shootButton} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path  d="M149.1 64.8L138.7 96 64 96C28.7 96 0 124.7 0 160L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64l-74.7 0L362.9 64.8C356.4 45.2 338.1 32 317.4 32L194.6 32c-20.7 0-39 13.2-45.5 32.8zM256 192a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"/>
      </svg>
      </>
      }
      {step==='PICTURE' && photo &&  <>
        <img className={classes.confirmPicture} src={photo} alt="Captured" />
        {
          isUploading
            ? <svg className={classes.spinner} width={40} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z"/></svg>
            : <svg onClick={()=>submitToBe()} className={classes.confirmButton} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>
        } 
      </>}

      {step==='VIEW' && card && <ViewCard card={card}/>}

    </div>

    </>
  )
    
}
