import { DbService } from "fbase";
import React, { useState } from "react";
import { createPortal } from "react-dom";

export default function Home(){
    const [nweet, setNweet] = useState("");
    const onSubmit = async (event)=>{
        event.preventDefault();
        await DbService.collection("jweets").add({
            nweet,
            createdAt: Date.now(),
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
        </div>
    )
}