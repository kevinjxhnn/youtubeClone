import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';


export default function Loader() {
  return (
    <Box sx={{ display: 'flex', height:"90vh", justifyContent:"center", alignItems:"center" }}>
      <CircularProgress sx={{color:"red"}}/>
    </Box>
  );
}