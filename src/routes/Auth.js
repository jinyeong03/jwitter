import { AuthService, FirebaseInstance } from "fbase";
import React, {useState} from "react";
import styles from "./Auth.module.css";

export default function Auth(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");

    const onChange = (event)=>{
        const {
            target: {name, value},
        } = event;
        if (name === "email"){
            setEmail(value);
        } else if (name === "password"){
            setPassword(value);
        }
    }

    const onSubmit = async (event)=>{
        event.preventDefault();
        try {
            let data;
            if(newAccount){
                //create account
                data = await AuthService.createUserWithEmailAndPassword( email, password)
            } else {
                //log in
                data = await AuthService.signInWithEmailAndPassword( email, password)
            }
            console.log(data)
        } catch(error){
            if(error.message == "Firebase: The email address is already in use by another account. (auth/email-already-in-use)."){
                alert("이미 만들어진 아이디 입니다.");
            }
            setError(error.message)
        }
    }

    const toggleAccount = ()=> setNewAccount((prev)=> !prev)

    const onSocialClick = async (event)=>{
        const {target: {name}} = event;
        let provider;
        if(name === "google"){
            provider = new FirebaseInstance.auth.GoogleAuthProvider();
        }else if (name === "github"){
            provider = new FirebaseInstance.auth.GoogleAuthProvider();
        }
        await AuthService.signInWithPopup(provider);
    }

    return(
        <div className={ styles.container }>
            <img src={process.env.PUBLIC_URL  + "/icon/twitter.png"} className={styles.loginLogo}/>
            <form onSubmit={onSubmit} className={styles.form}>
                <input name="email" type="text" placeholder="Email" required value={email} onChange={onChange} className={styles.input}/>
                <input name="password" type="password" placeholder="Password" required value={password} onChange={onChange} className={styles.input}/>
                <input type="submit" value={newAccount ? "Create Account" : "Log In"} className={styles.submit}/>
            </form>
            <span onClick={toggleAccount} className={styles.loginToggleSpan}>{newAccount ? "Sign in" : "Create Account"}</span>
            <div className={ styles.otherLoginBtnDiv }> 
                <button name="google" onClick={onSocialClick} className={styles.otherLoginBtn}>Continue with Google <img src={process.env.PUBLIC_URL  + "/icon/google.png"} className={styles.otherLoginBtnIcon} /></button>
                <button name="github" onClick={onSocialClick} className={styles.otherLoginBtn}>Continue with Google <img src={process.env.PUBLIC_URL  + "/icon/google.png"} className={styles.otherLoginBtnIcon} /></button>
            </div>
        </div>
    )
}