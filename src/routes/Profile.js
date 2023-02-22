import { AuthService } from "fbase";
import React from "react";
import { useHistory } from "react-router-dom";

export default function Profile(){
    const history = useHistory();
    const onLogOutClick = ()=>{
        AuthService.signOut();
        history.push("/");
    }
    return(
        <>
            <span>Profile</span>
            <button onClick={onLogOutClick}>Log Out</button>
        </>
    )
}