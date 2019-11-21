import React from 'react'

function Card({ editions, openOverlay }) {
  let { setIdx } = editions

  return (
    <div
      className='trade-card vert-ctr-parent'
      onClick={() => openOverlay(editions)}
    >
      <div className='vert-ctr'>
        <div className='trade-card-text ellipsis' style={{fontSize: '1em', float: 'left'}}>
          {editions[setIdx].name}
          <br/>
          {`$${editions[setIdx].prices.usd}`}
        </div>
        <div style={{float: 'right'}}><i className={`ss ss-2x ss-${editions[setIdx].set}`} /></div>
      </div>
    </div>
  )
}

export default Card
