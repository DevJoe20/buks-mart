import BiscuitsCookies from '@/components/HomePage/BiscuitsCookies'
import HeroSlider from '@/components/HomePage/HeroSlider'
import Testimonial from '@/components/HomePage/Testimonial'
import Newsletter from '@/components/Newsletter'
import React from 'react'

const page = () => {
  return (
    <div>
      <HeroSlider />
      <BiscuitsCookies />
      <Testimonial />
      <Newsletter />
    </div>
  )
}

export default page