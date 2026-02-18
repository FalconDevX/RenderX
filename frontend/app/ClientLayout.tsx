'use client'

import { useEffect, useState, useRef } from "react"
import { usePathname } from "next/navigation"
import { LoadingSpinner } from "@/components/Spinner"
import { AnimatePresence, motion } from "framer-motion"
import { useAuth } from "@/api/useAuth.store";
import { useCartStore } from "@/api/useCartStore";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const lastUserIdRef = useRef<string | null>(null);

  const isExcluded = pathname.startsWith('/auth')
  const { refresh } = useAuth();
  const isInitialMountRef = useRef(true);
  
  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      const doRefresh = async () => {
        const currentState = useAuth.getState();
        if (!currentState.accessToken) {
          await refresh();
        }
      };
      doRefresh();
    }
  }, [refresh]);

  useEffect(() => {
    if (isExcluded) {
      setIsLoading(false)
      return
    }

    const handleLoad = () => setIsLoading(false)
    if (document.readyState === "complete") setIsLoading(false)
    else window.addEventListener("load", handleLoad)
    return () => window.removeEventListener("load", handleLoad)
  }, [isExcluded])

  if (isExcluded) {
    return <>{children}</>
  }

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="spinner"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
          >
            <LoadingSpinner />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        key="content"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.6, delay: isLoading ? 0 : 0.2 }}
      >
        {children}
      </motion.div>
    </>
  )
}