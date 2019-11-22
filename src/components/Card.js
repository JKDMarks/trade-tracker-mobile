import React from 'react'
import { Grid } from 'semantic-ui-react'

function Card({ card, openOverlay, tradeIdx, cardPrice }) {
  const { editions, setIdx, isFoil, quantity } = card

  return (
    <div
      className={`trade-card vert-ctr-parent ${isFoil ? 'foil-bkgr' : null}`}
      onClick={() => openOverlay(card, tradeIdx)}
    >
      <Grid centered className='m-0' style={{height: '100%'}}>
        <Grid.Row className='p-0' verticalAlign='middle'>
          <Grid.Column width={10} className='trade-card-text ellipsis' style={{fontSize: '1em', float: 'left'}}>
            {editions[setIdx].name}
            <br/>
            ${cardPrice(card)}
            <br/>
            x{quantity} = {cardPrice(card) * quantity}
          </Grid.Column>
          <Grid.Column width={6}><i className={`ss ss-2x ss-${editions[setIdx].set}`} /></Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  )
}

export default Card
