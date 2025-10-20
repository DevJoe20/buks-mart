"use client";

import { useEffect, useState } from 'react'
import { supabase } from '../../../supabaseClient'
import { FaCartPlus } from 'react-icons/fa'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { motion, AnimatePresence } from 'framer-motion'

const BiscuitsCookies = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBiscuitsCookies = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')

      if (error) {
        console.error('Error fetching products:', error)
      } else {
        setProducts(data)
      }
      setLoading(false)
    }

    fetchBiscuitsCookies()
  }, [])

  const handleAddToCart = (productName) => {
    toast.success(`${productName} added to cart!`)
  }

  if (loading) return <p className="text-center py-8">Loading...</p>

  return (
    <section className="p-4 sm:p-6 lg:p-10">
      
      {/* ---------------- MOBILE/TABLET: Masonry ---------------- */}
      <div className="block lg:hidden">
        <div className="columns-2 sm:columns-3 gap-4">
          <AnimatePresence>
            {products.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="mb-4 break-inside-avoid bg-white rounded-xl shadow hover:shadow-lg transition-all p-3 flex flex-col cursor-pointer"
              >
                <Link href={`/product/${product.id}`}>
                  <div className="relative w-full h-44 flex items-center justify-center bg-white">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-contain rounded"
                    />
                  </div>
                  <div className="mt-3 flex-grow">
                    <h3 className="text-sm sm:text-base font-bold text-gray-800 truncate">
                      {product.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500">{product.brand}</p>
                  </div>
                  <div className="mt-1 sm:mt-2 text-sm sm:text-base font-bold text-orange-500">
                    £{product.price.toLocaleString()}
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* ---------------- DESKTOP: Grid ---------------- */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-4 gap-6">
          <AnimatePresence>
            {products.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-xl shadow hover:shadow-lg transition-all p-3 flex flex-col cursor-pointer"
              >
                <Link href={`/product/${product.id}`}>
                  <div className="relative w-full h-52 flex items-center justify-center bg-white">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-contain rounded"
                    />
                  </div>
                  <div className="mt-3 flex-grow">
                    <h3 className="text-base lg:text-lg font-bold text-gray-800 truncate">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500">{product.brand}</p>
                  </div>
                  <div className="mt-2 text-base font-bold text-orange-500">
                    £{product.price.toLocaleString()}
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

    </section>
  )
}

export default BiscuitsCookies
