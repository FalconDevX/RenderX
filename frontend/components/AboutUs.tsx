"use client"

import React from 'react'
import Header from './Header'
import { Award, Users, ShoppingBag, Heart } from 'lucide-react'

const AboutUs = () => {
  const features = [
    {
      icon: <ShoppingBag className="w-8 h-8" />,
      title: "Quality Products",
      description: "We offer only the best graphics cards from trusted manufacturers"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Expert Team",
      description: "Our team consists of hardware enthusiasts with years of experience"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Customer First",
      description: "Your satisfaction is our top priority. We're here to help you find the perfect GPU"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Passion Driven",
      description: "We're passionate about technology and gaming, just like you"
    }
  ]

  const stats = [
    { number: "10K+", label: "Happy Customers" },
    { number: "500+", label: "Products Available" },
    { number: "15+", label: "Years Experience" },
    { number: "24/7", label: "Support" }
  ]

  return (
    <div className="min-h-screen bg-[#0F1115]">
      <Header />
      
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-24">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">About RenderX</h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            Your trusted partner for premium graphics cards and gaming hardware
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-24">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                RenderX was founded with a simple mission: to provide gamers, content creators, and PC enthusiasts 
                with access to the best graphics cards on the market. We understand that finding the right GPU can 
                be overwhelming, which is why we've made it our goal to simplify the process.
              </p>
              <p>
                What started as a small passion project has grown into a trusted platform where thousands of customers 
                find their perfect graphics card. We work directly with manufacturers to ensure you get authentic, 
                high-quality products at competitive prices.
              </p>
              <p>
                Our team is made up of hardware enthusiasts who understand the importance of having the right tools 
                for your projects. Whether you're building a gaming rig, setting up a workstation, or upgrading your 
                existing system, we're here to help you make the right choice.
              </p>
            </div>
          </div>

          <div className="bg-[#1A1D21] rounded-lg p-8">
            <h3 className="text-2xl font-semibold text-white mb-6">Why Choose Us?</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-300">Authentic products from authorized distributors</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-300">Competitive pricing and regular promotions</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-300">Fast and secure shipping</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-300">Expert customer support</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-300">Easy returns and warranty support</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
          {stats.map((stat, index) => (
            <div key={index} className="bg-[#1A1D21] rounded-lg p-6 text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-2">{stat.number}</div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="mb-24">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">What We Offer</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-[#1A1D21] rounded-lg p-6 hover:bg-[#1f2226] transition-colors">
                <div className="text-orange-500 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1A1D21] rounded-lg p-8 md:p-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Our Mission</h2>
          <p className="text-gray-300 text-lg text-center max-w-3xl mx-auto">
            To empower every gamer, creator, and tech enthusiast with the graphics cards they need to bring their 
            visions to life. We believe that everyone deserves access to quality hardware, and we're committed to 
            making that happen through transparent pricing, excellent service, and a genuine passion for technology.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AboutUs
