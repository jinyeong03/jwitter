import { AuthService, DbService } from "fbase";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

export default function Profile({ userObj }){
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

    const history = useHistory();
    const onLogOutClick = ()=>{ //---------> logout 
        AuthService.signOut();
        history.push("/");
    }

    const getMyNweets = async ()=>{
        const nweets = await DbService.collection("nweets").where("creatorId", "==", userObj.uid).orderBy("createdAt").get(); // Firebase 쿼리로 데이터 받아오는 법
    }

    const onChange = (event)=>{
        const { target: {value} } = event;
        setNewDisplayName(value);
    }

    const onSubmit = async (event)=>{
        event.preventDefault();
        if(userObj.displayName !== newDisplayName){
            await userObj.updateProfile({
                displayName: newDisplayName,
            });
        }
    }

    useEffect(()=>{
        getMyNweets();  
    }, [])

    return(
        <>
            <form onSubmit={onSubmit}>
                <input type="text" placeholder="Display name" onChange={onChange} value={newDisplayName} />
                <input type="submit" value="Update Profile" />
            </form>
            <button onClick={onLogOutClick}>Log Out</button>
        </>
    )
}