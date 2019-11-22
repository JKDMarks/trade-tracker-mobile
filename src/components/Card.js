import React from 'react'
import { cardPrice } from '../helpers'


function Card({ card, openOverlay, tradeIdx }) {
  const { editions, setIdx, isFoil } = card

  return (
    <div
      className={`trade-card vert-ctr-parent ${isFoil ? 'foil-bkgr' : null}`}
      onClick={() => openOverlay(card, tradeIdx)}
    >
      <div className='vert-ctr'>
        <div className='trade-card-text ellipsis' style={{fontSize: '1em', float: 'left'}}>
          {editions[setIdx].name}
          <br/>
          {`$${cardPrice(card)}`}
        </div>
        <div style={{float: 'right'}}><i className={`ss ss-2x ss-${editions[setIdx].set}`} /></div>
      </div>
    </div>
  )
}

export default Card
