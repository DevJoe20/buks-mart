import React from 'react'
import JoinCommunity from '../../components/NewsletterPage/JoinCommunity'
import NewsBenefits from '../../components/NewsletterPage/NewsBenefits'
import DontMiss from '../../components/NewsletterPage/DontMiss'
import StayConnected from '../../components/NewsletterPage/StayConnected'


const page = () => {
  return (
    <div>
        <StayConnected />
        <JoinCommunity />
        <NewsBenefits />
        <DontMiss />
    </div>
  )
}

export default page