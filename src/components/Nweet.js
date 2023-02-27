import { DbService, StorageService } from "fbase";
import React, { useState } from "react";
import styles from "./Nweet.module.css";

export default function Nweet({ nweetObj, isOwner }){
    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text);

    const onDeleteClick = async ()=>{   //----------> 데이터 삭제 
        const ok = window.confirm("정말 이 게시물을 삭제하시겠습니까?");
        if(ok){
            //delete 
            await DbService.doc(`nweets/${nweetObj.id}`).delete(); //글 지우기 
            await StorageService.refFromURL(nweetObj.attachmentUrl).delete(); //사진 지우기
        }
    }

    const toggleEditing = ()=>{ //----------> Edit 토글 
        setEditing((prev)=> !prev)
    }

    const onSubmit = async (event)=>{   //------------> 데이터 업데이트 
        event.preventDefault();
        await DbService.doc(`nweets/${nweetObj.id}`).update({
            text: newNweet,
        })
        setEditing(false);
    }

    const onChange = (event)=>{ //-------------> onChange input 값 state에 넣어줌
        const { target: {value} } = event;
        setNewNweet(value);
    }

    return(
        <div>
            {
                editing ? (
                    <div className={styles.postingEditDiv}>
                        <form onSubmit={onSubmit} style={{width: "100%"}}>
                            <input type="text" onChange={onChange} placeholder="Edit your posting" value={newNweet} required className={styles.input} />
                            <input type="submit" value="Update Posting" className={styles.inputEdit}/>
                        </form>
                        <button onClick={toggleEditing} className={styles.inputCancle} >Cancel</button> 
                    </div>
                ) : ( 
                <div className={styles.container}>
                    <h4 className={styles.postingH4}>{nweetObj.text}</h4>
                    { nweetObj.attachmentUrl && <img src={nweetObj.attachmentUrl} className={styles.postingImg} /> }
                    {
                        isOwner && (
                            <div className={styles.editDiv}>
                                <img onClick={onDeleteClick} src={process.env.PUBLIC_URL  + "/icon/bin.png"} className={styles.postingEditIcon}></img>
                                <img onClick={toggleEditing} src={process.env.PUBLIC_URL  + "/icon/pencil.png"} className={styles.postingEditIcon}></img>
                            </div>
                        )
                    }
                </div>
                )
            }
        </div>
    );
}