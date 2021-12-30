import React from 'react'

export default function Message({ name, message }) {
    return (
        <h3>
            {name}: {message}
        </h3>
    )
}
