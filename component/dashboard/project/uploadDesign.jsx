import React from 'react'

function uploadDesign() {
  return (
    <div><div className="accordion divide-neutral/20 divide-y">
    <div className="accordion-item active" id="payment-icon">
      <button className="accordion-toggle inline-flex items-center justify-between text-start" aria-controls="payment-icon-collapse" aria-expanded="true">
        <span className="inline-flex items-center gap-x-4">
          <span className="icon-[tabler--credit-card-pay] text-base-content size-6"></span>
          When is payment taken for my order?
        </span>
        <span className="icon-[tabler--chevron-left] accordion-item-active:-rotate-90 text-base- size-4.5 shrink-0 transition-transform duration-300 rtl:-rotate-180" ></span>
      </button>
      <div id="payment-icon-collapse" className="accordion-content w-full overflow-hidden transition-[height] duration-300" aria-labelledby="payment-icon" role="region">
        <div className="px-5 pb-4">
          <p className="text-base-content/80 font-normal">
            Payment is taken during the checkout process when you pay for your order. The order number that appears on the
            confirmation screen indicates payment has been successfully processed.
          </p>
        </div>
      </div>
    </div>
    <div className="accordion-item" id="delivery-icon">
      <button className="accordion-toggle inline-flex items-center justify-between text-start" aria-controls="delivery-icon-collapse" aria-expanded="false">
        <span className="inline-flex items-center gap-x-4">
          <span className="icon-[tabler--shopping-bag] text-base-content size-6"></span>
          How would you ship my order?
        </span>
        <span className="icon-[tabler--chevron-left] accordion-item-active:-rotate-90 text-base- size-4.5 shrink-0 transition-transform duration-300 rtl:-rotate-180" ></span>
      </button>
      <div id="delivery-icon-collapse" className="accordion-content hidden w-full overflow-hidden transition-[height] duration-300" aria-labelledby="delivery-icon" role="region">
        <div className="px-5 pb-4">
          <p className="text-base-content/80 font-normal">
            For large products, we deliver your product via a third party logistics company offering you the “room of
            choice” scheduled delivery service. For small products, we offer free parcel delivery.
          </p>
        </div>
      </div>
    </div>
    <div className="accordion-item" id="cancel-icon">
      <button className="accordion-toggle inline-flex items-center justify-between text-start" aria-controls="cancel-icon-collapse" aria-expanded="false">
        <span className="inline-flex items-center gap-x-4">
          <span className="icon-[tabler--ban] text-base-content size-6"></span>
          Can I cancel my order?
        </span>
        <span className="icon-[tabler--chevron-left] accordion-item-active:-rotate-90 text-base- size-4.5 shrink-0 transition-transform duration-300 rtl:-rotate-180" ></span>
      </button>
      <div id="cancel-icon-collapse" className="accordion-content hidden w-full overflow-hidden transition-[height] duration-300" aria-labelledby="cancel-icon" role="region">
        <div className="px-5 pb-4">
          <p className="text-base-content/80 font-normal">
            Scheduled delivery orders can be cancelled 72 hours prior to your selected delivery date for full refund.
          </p>
        </div>
      </div>
    </div>
  </div></div>
  )
}

export default uploadDesign