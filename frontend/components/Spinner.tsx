'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export const LoadingSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-transparent z-50 invert sepia saturate-[10000%] hue-rotate-[200deg]">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
    >
      <Image
        src="/loading-fan.png"
        alt="Loading fan"
        width={110}
        height={110}
        className="opacity-90"
      />
    </motion.div>
  </div>
)

export const InlineSpinner = ({ size = 80 }: { size?: number }) => (
  <div className="flex items-center justify-center invert sepia saturate-[10000%] hue-rotate-[200deg]">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
    >
      <Image
        src="/loading-fan.png"
        alt="Loading"
        width={size}
        height={size}
        className="opacity-90"
      />
    </motion.div>
  </div>
)