import { DbService } from "fbase";
import React, { useState } from "react";


export default function Nweet({ nweetObj, isOwner }){
    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text);

    const onDeleteClick = async ()=>{   //----------> 데이터 삭제 
        const ok = window.confirm("정말 이 nweet를 삭제하시겠습니까?");
        if(ok){
            //delete 
            await DbService.doc(`nweets/${nweetObj.id}`).delete();
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
                    <>
                        <form onSubmit={onSubmit}>
                            <input type="text" onChange={onChange} placeholder="Edit your nweet" value={newNweet} required />
                            <input type="submit" value="Update Nweet"/>
                        </form>
                        <button onClick={toggleEditing}>Cancel</button> 
                    </>
                ) : ( 
                <>
                    <h4>{nweetObj.text}</h4>
                    { nweetObj.attachmentUrl && <img src={nweetObj.attachment} witdh="50px" height="50px" /> }
                    {
                        isOwner && (
                            <>
                                <button onClick={onDeleteClick}>Delete Nweet</button>
                                <button onClick={toggleEditing}>Edit Nweet</button>
                            </>
                        )
                    }
                </>
                )
            }
        </div>
    );
}