"use client";

import { useEffect, useState } from 'react'
import { supabase } from '../../../supabaseClient'
// import toast from 'react-hot-toast'
import { FaCartPlus } from 'react-icons/fa'
import Link from 'next/link'
import { toast } from 'react-toastify';

// const CATEGORY_ID = 'dc490c52-55ed-445a-9336-a2b905fccb11'

const BiscuitsCookies = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBiscuitsCookies = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        // .eq('category_id', CATEGORY_ID)
        // .limit(5)

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
      {/* <div className="flex items-center justify-between mb-6">
        <h2 className="text-blue-500 text-xl sm:text-2xl font-bold">
          Biscuits & Cookies
        </h2>
        <a href="/products/biscuits-cookies" className="text-blue-600 text-sm hover:underline">
          View All <span className="ml-1 text-base sm:text-lg">→</span>
        </a>
      </div> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition-all p-3 flex flex-col"
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
              <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-800 truncate">{product.name}</h3>
              <p className="text-xs sm:text-sm text-gray-500">{product.brand}</p>
            </div>
            <div className="mt-1 sm:mt-2 text-sm sm:text-base font-bold text-orange-500">
              £{product.price.toLocaleString()}
            </div>
            {/* <button
              onClick={() => handleAddToCart(product.name)}
              className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-md font-medium flex items-center justify-center gap-2"
            >
              <FaCartPlus />
              Add to Cart
            </button> */}
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}

export default BiscuitsCookies
