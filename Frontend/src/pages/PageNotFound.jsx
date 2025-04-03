import React from 'react'

const PageNotFound = () => {
  return (
    <>
       <div className="p-6 flex items-center justify-center bg-gray-100 overflow-x-hidden">
      <div className="p-40  bg-white shadow-md rounded-md">
        <h1 className="text-4xl font-bold text-red-500 ">404 - Page Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">
          The page you're looking for might have been removed or is temporarily unavailable.
        </p>
        <a href="/" className="text-red-900 hover:underline">
          Go back to home
        </a>
      </div>
    </div>
    </>
  )
}

export default PageNotFound
