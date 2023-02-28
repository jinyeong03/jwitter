import Nweet from "components/Nweet";
import { DbService, StorageService } from "fbase";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import styles from "./Home.module.css";

export default function Home({userObj}){
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    const [attachment, setAttachment] = useState("");
    const [loding, setLoding] = useState(false);

    useEffect(()=>{
        DbService.collection("nweets").onSnapshot(sanpshot => {      //---------> 얘는 데이터 가져오는데 re-render 필요 없음
            const nweetArray = sanpshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setNweets(nweetArray)
        });
    },[])

    const onSubmit = async (event)=>{ //---------------> 데이터 추가 
        event.preventDefault();

        if(nweet == ""){
            alert("글을 입력해주세요.")
            return false;
        }

        setLoding(true)

        let attachmentUrl = "";
        if(attachment !== ""){ // 사진이 있다면 
            const attachmentRef = StorageService.ref().child(`${userObj.uid}/${uuidv4()}`); // -------------> Ref 만들기
            const reponse = await attachmentRef.putString(attachment, "data_url"); // ---------> Ref 만든거와 attachment 이용해서 storage에 올리기
            attachmentUrl = await reponse.ref.getDownloadURL(); //------------> 올린 이미지 다운로드 주소 받기 
        }
        const nweetObj = {
            text: nweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl,
        }
        await DbService.collection("nweets").add(nweetObj);  //올라간 이미지 및 정보들 데이터 추가 
        setNweet("");  // 초기화
        setAttachment(""); // 사진 초기화
        setLoding(false);
    }

    const onChange = (event)=>{  //-------------> onchange input 값 state에 추가
        const {target: {value}} = event;
        setNweet(value);
    }

    const onFileChange = (event)=>{   //-----------------> 이미지 미리보기 함수 (attachment state 활용)
        //event.target.files 
        const {target: { files }} = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = ((finishedEvent)=>{  //---------------> 밑에서 url을 읽는게 끝나면 실행 
            const { currentTarget: { result } } = finishedEvent;
            setAttachment(result);
        })
        reader.readAsDataURL(theFile);
    }

    const onClearAttachment = ()=> { //---------------> 이미지 미리보기 clear 함수 (attachment state 활용)
        setAttachment("");
    }

    return(
        loding == false ?
            <div className={styles.container}>
                <form onSubmit={onSubmit} className={styles.form}>
                    <input value={nweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} className={styles.input}></input>
                    <input type="file" id="attachment" accept="image/*" onChange={onFileChange} style={{display: "none"}}/>
                    <input type="submit" value="Posting" className={styles.submit} ></input>
                    <div className={styles.addImgDiv} onClick={()=>{
                        const file = document.querySelector('#attachment');
                        file.click();
                    }}> 
                        <span className={ styles.addImgSpan }>Add Photos</span>
                        <img src={process.env.PUBLIC_URL  + "/icon/add.png"} className={styles.addImgIcon}></img>
                    </div>
                    { attachment && (
                        <div className={styles.postImgDiv}>
                            <img src={attachment} className={styles.postImg}/>
                            <div onClick={onClearAttachment} className={styles.postDeleteDiv}>
                                <span className={styles.postDeleteSpan}>remove</span>
                                <img src={process.env.PUBLIC_URL  + "/icon/close.png"} className={styles.postDeleteImg}></img>
                            </div>
                        </div> 
                    )}
                </form>
                <div>
                    {nweets.map((nweet) => (
                        <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid} />
                    ))}
                </div>
            </div>
        :
            <span style={{color: "white", fontSize: "1.1rem"}}>업로드 중입니다...</span>
    )
}