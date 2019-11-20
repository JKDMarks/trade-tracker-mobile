import React from 'react'

function Card({ card }) {
  let i = 0

  return (
    <div className='trade-card'>
      <p style={{fontSize: '1.5em', float: 'left', margin: '0'}}>
        {card[i].name}
        <br/>
        {`$${card[i].prices.usd}`}
      </p>
      <p style={{float: 'right'}}><i className={`ss ss-2x ss-${card[i].set}`} /></p>
    </div>
  )
}

export default Card
