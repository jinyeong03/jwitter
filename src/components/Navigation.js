import React from "react";
import { Link } from "react-router-dom";
import styles from "./Navigation.module.css";

export default function Navigation({ userObj }){
    return(
        <nav className={styles.navigationDiv}>
            <ul className={styles.navigationUl}>
                <li className={styles.navigationLi}>
                    <Link to="/"><img src={process.env.PUBLIC_URL  + "/icon/twitter.png"} className={styles.homeLogo}></img></Link>
                </li>
                <li className={styles.navigationLi}>
                    <Link to="/profile" className={styles.profileDiv}>
                        <img src={process.env.PUBLIC_URL  + "/icon/user.png"} className={styles.profileLogo}></img>
                        <span className={styles.profileSpan}>{userObj.displayName}</span>
                    </Link>
                </li>
            </ul>
        </nav>
    );
}