import React from 'react'
import { Hero } from './components/Hero'
import  NavBar from './components/Navbar'
import AboutSection from './components/About'
import FeaturesGrid from './components/Features'
import { HowItWorks } from './components/HowItWorks'
import { DevelopersSection } from './components/Team'
import { ParallaxFooter } from './components/Footer'

const App = () => {
  return (
    <div>
      <NavBar />
      <Hero />
      <AboutSection />
      <FeaturesGrid />
      <HowItWorks />
      <DevelopersSection />
      <ParallaxFooter />
      {/* <div className='min-h-screen'></div> */}
    </div>
  )
}

export default App