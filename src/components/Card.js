import React from 'react'

function Card({ card }) {
  return (
    <div className='trade-card'>
      {card[0].name}
      <i className="ss ss-m10" />
    </div>
  )
}

export default Card
