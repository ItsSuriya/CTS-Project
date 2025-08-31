'use client';

import React from 'react';
import { InteractiveRobotSpline } from '@/components/ui/interactive-3d-robot'
import { GradualSpacing } from './ui/text';

export function Hero() { 
  
  const ROBOT_SCENE_URL = "https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode";

  return (
   
    <div className="relative w-screen h-screen overflow-hidden">

      <InteractiveRobotSpline
        scene={ROBOT_SCENE_URL}
        className="absolute inset-0 z-0" 
      />

    
      <div className= "absolute inset-0 z-10 pt-20 md:pt-32 lg:pt-40 px-4 md:px-8 pointer-events-none" >
        <div className=" text-center w-full max-w-2xl mx-auto" >
        <GradualSpacing
          className="font-display text-center text-4xl font-bold -tracking-widest  text-purple-500 dark:text-white md:text-7xl md:leading-[5rem]"
          text="Predict. Prevent. Protect."
        />
        </div>
      </div>

    </div> 
  );
}