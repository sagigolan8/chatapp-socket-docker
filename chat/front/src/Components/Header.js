import { AppBar,Typography } from '@material-ui/core'
import React from 'react'

export default function Header() {
  return (
        <>
          <AppBar>
              <div style={{textAlign:'center',fontFamily:'monospace'}}>
                 <Typography
                 color="inherit"
                 variant='h2'
                 >
                   Chat Room
                </Typography>
             </div>
          </AppBar>
          <br/>
          <br/>
          <br/>
          <br/>
        </>
  )
}
