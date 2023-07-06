import { Typography } from '@mui/material';
import React from 'react';
import "./About.css";

function About() {
  return (
    <div className='about'>
        <div className='aboutContainer'>
            <Typography>
            “If you are depressed you are living in the past.
            If you are anxious you are living in the future.
            If you are at peace you are living in the present.”
            </Typography>
        </div>
        <div className='aboutContainer2'>
            <div>
              <img src="/images/O1-01.png" alt="Anuj" className='aboutAvatar' />
              <Typography variant="h4" 
              style={{
                margin: "1vmax 0", color: "black"
              }}>ANUJ
              </Typography>
              <Typography>DSA | Blender | VFX | MERN stack | Unity</Typography>
              <Typography style={{
                margin: "1vmax 0"
              }}>I am a Student at <b>IIT KHARAGPUR</b></Typography>
            </div>

            <div>
              <Typography style={{
                wordSpacing: "4px",
                lineHeight: "40px",
                letterSpacing: "4px",
                textAlign: "right"
              }}>
              Design Head @ <b>CGS(Computer Graphics Society)</b>. 
              I am <b>3d artist</b> specialized in <b>Blender ,Zbrush, 
              Substance Painter, 3Ds Max, Maya, Marvelous Designer </b>  
              and many more. I also do Competetive Programming @ 
              Codeforces(1283) and Codechef(1708). I am a Full 
              stack Web developer and also a Freelancer.
              </Typography>
            </div>
        </div>
    </div>
  )
}

export default About