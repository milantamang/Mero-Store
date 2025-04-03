import React from 'react'

const Feature = () => {
  return (
    <>
    <div className="container mx-auto py-12">
  <div className="w-10/12 grid grid-cols-1 md:grid-cols-3 gap-6 mx-auto justify-center">
    <div className="border-2 border-primary  rounded-sm px-3 py-6 flex justify-center vanicon items-center gap-5">
      <img src="/images/icons/delivery-van.svg" alt="Delivery" className="w-12 h-12 object-contain " />
      <div>
        <h4 className="font-medium capitalize text-lg">Free Shipping </h4>
        <p className="text-gray-500 text-sm">Order over Rs.2000</p>
      </div>
    </div>
    <div className="border-2 border-primary rounded-sm px-3 py-6 flex justify-center items-center gap-5">
      <img src="/images/icons/money-back.svg" alt="Delivery" className="w-12 h-12 object-contain" />
      <div>
        <h4 className="font-medium capitalize text-lg">Money Returns</h4>
        <p className="text-gray-500 text-sm">30 days money returs</p>
      </div>
    </div>
    <div className="border-2 border-primary rounded-sm px-3 py-6 flex justify-center items-center gap-5">
      <img src="/images/icons/service-hours.svg" alt="Delivery" className="w-12 h-12 object-contain" />
      <div>
        <h4 className="font-medium capitalize text-lg">24/7 Support</h4>
        <p className="text-gray-500 text-sm">Customer support</p>
      </div>
    </div>
  </div>
</div>
      
    </>
  )
}

export default Feature
