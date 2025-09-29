import AdminSidebar from '@/components/AdminDashboard/AdminSidebar'
import React from 'react'

const layout = ({ children }) => {
  return (
    <div>
        <div className="flex">
          <AdminSidebar />
          <main className="w-full flex-1 bg-gray-100 p-6">{children}</main>
        </div>
    </div>
  )
}

export default layout