"use client"

import React from 'react'
import Header from './Header'
import FeatureProd from './FeatureProd'
import Search from './Search'

const Home = () => {
  return (
    <div>
      <div className="sticky top-0 z-10">
        <Header />
        <Search />
      </div>
        <FeatureProd />
    </div>
  )
}

export default Home