import React from "react";


export default function Nweet({ nweetObj, isOwner }){
    return(
        <div>
            <h4>{nweetObj.text}</h4>
            {
                isOwner && (
                    <>
                        <button>Delete Nweet</button>
                        <button>Edit Nweet</button>
                    </>
                )
            }
        </div>
    );
}