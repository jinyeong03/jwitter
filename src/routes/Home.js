import { DbService } from "fbase";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function Home({userObj}){
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    
    // const getJweets = async ()=>{    ----------->  이건 구식 데이터 가져오기 (re-render 해줘야함)
    //     const dbJweets = await DbService.collection("jweets").get();
    //     dbJweets.forEach((document)=>{
    //         const jweetObject = {
    //             ...document.data(),
    //             id: document.id,
    //         }
    //         setNweets((prev) => [jweetObject, ...prev])
    //     })
    // }   

    useEffect(()=>{
        // getJweets();
        DbService.collection("jweets").onSnapshot(sanpshot => {      //---------> 얘는 데이터 가져오는데 re-render 필요 없음
            const nweetArray = sanpshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setNweets(nweetArray)
        });
    },[])

    const onSubmit = async (event)=>{
        event.preventDefault();
        await DbService.collection("jweets").add({
            text: nweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
        });
        setNweet("");
    }

    const onChange = (event)=>{
        const {target: {value}} = event;
        setNweet(value);
    }
    return(
        <div>
            <form onSubmit={onSubmit}>
                <input value={nweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120}></input>
                <input type="submit" value="Nweet" />
            </form>
            <div>
                {nweets.map((nweet) => (
                <div key={nweet.id}>
                    <h4>{nweet.text}</h4>
                </div>
                ))}
            </div>
        </div>
    )
}