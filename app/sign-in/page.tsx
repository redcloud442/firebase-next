import React from 'react'
import { UnprotectedRoute } from '@/utils/protection'
import SignIn from '@/components/SignInPage/SignInPage'
const page = async () => {
  await UnprotectedRoute();

  return (
  
      <SignIn />
   
  )
}

export default page