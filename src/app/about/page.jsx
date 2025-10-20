import React from 'react'
import Tradition from '../../components/AboutPage/Tradition'
import AboutUs from '../../components/AboutPage/AboutUs'
import Value from '../../components/AboutPage/Value'
import Community from '../../components/AboutPage/Community'

const page = () => {
  return (
    <div>
      <AboutUs />
      <Tradition />
      <Value />
      <Community />
    </div>
  )
}

export default page