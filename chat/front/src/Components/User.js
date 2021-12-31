import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import React from 'react'

export default function User({id ,name, privateMessage, userName}) {
    return (
        <div>
            { userName === name
            ? 
            (
                <li
                style={{cursor:'default'}} 
                className='list-group-item rounded border-0'
                style={{cursor:'pointer'}}
                key={id}
                >
                <FiberManualRecordIcon sx={{color:'green'}}/>
                Me
                </li>
            ) 
            : 
            (
                <li 
                className='list-group-item rounded border-0'
                style={{cursor:'pointer'}}
                onClick={()=>privateMessage(name)}
                key={id}
                >
                <FiberManualRecordIcon sx={{color:'green'}}/>
                {name}
                </li>
            ) 
            }
        </div>
    )
}
