import Nweet from "components/Nweet";
import { DbService } from "fbase";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function Home({userObj}){
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    const [attachment, setAttachment] = useState();

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
        await DbService.collection("nweets").add({
            text: nweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
        });
        setNweet("");
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
        setAttachment(null);
    }

    return(
        <div>
            <form onSubmit={onSubmit}>
                <input value={nweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120}></input>
                <input type="file" accept="image/*" onChange={onFileChange}/>
                <input type="submit" value="Nweet" />
                { attachment && (
                    <div>
                        <img src={attachment} width="50px" height="50px" />
                        <button onClick={onClearAttachment}>Clear</button>
                    </div> 
                )}
            </form>
            <div>
                {nweets.map((nweet) => (
                    <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid} />
                ))}
            </div>
        </div>
    )
}