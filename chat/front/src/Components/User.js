import React from 'react'

export default function User({id ,name, privateMessage, userName}) {
    return (
        <div>
        { userName === name
         ? '' 
         : 
         (
         <div style={{cursor:'pointer'}} onClick={()=>privateMessage(name)} key={id}>
            {name}
            </div>
        ) 
        }

        </div>
    )
}
