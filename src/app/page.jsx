// import BiscuitsCookies from '@/components/HomePage/BiscuitsCookies'
import HeroSlider from '@/components/HomePage/HeroSlider'
import PopularNaijaSnacks from '@/components/HomePage/PopularNaijaSnacks'
import ReadyToShop from '@/components/HomePage/ReadyToShop'
import Testimonial from '@/components/HomePage/Testimonial'
import WhyChooseUs from '@/components/HomePage/WhyChooseUs'
// import Newsletter from '@/components/Newsletter'
import React from 'react'

const page = () => {
  return (
    <div>
      <HeroSlider />
      <WhyChooseUs />
      <PopularNaijaSnacks />
      <ReadyToShop />
      {/* <BiscuitsCookies /> */}
      <Testimonial />
      {/* <Newsletter /> */}
    </div>
  )
}

export default page