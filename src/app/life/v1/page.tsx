'use client'
import React, { use, useEffect, useState } from 'react'
import useUser from '@/src/hooks/useUser'

export default function page() {
  const [isMounted, setIsMounted] = useState(false)
  const { initUser } = useUser()

  useEffect(() => {
    setIsMounted(true)
    initUser()
  }, [])
  if (!isMounted) {
    return null
  }

  return (
    <div className='w-full flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-8'>
      base
    </div>
  )
}
