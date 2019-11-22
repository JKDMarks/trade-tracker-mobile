import React, { Fragment } from 'react'
import { Modal, Grid, Dropdown, Checkbox } from 'semantic-ui-react'
import { cardPrice } from '../helpers'

function Overlay({ card, tradeIdx, isOpen, closeOverlay, editCardSet, toggleFoil }) {
  if (card && Object.entries(card).length > 0) {
    const { editions, setIdx, isFoil, isLeft } = card
    console.log(setIdx, isFoil, isLeft, tradeIdx)

    return (
      <Modal className='ctr-txt' open={isOpen} onClose={closeOverlay}>
        <Modal.Content className='vert-ctr-parent'>
          {
            (editions && editions.length > 0) ? (
              <Grid centered className='vert-ctr'>
                <Grid.Row>
                  <Grid.Column width={8} textAlign='center'>
                    Card Price: ${cardPrice(card)}
                  </Grid.Column>

                  <Grid.Column width={8} textAlign='center'>
                    <Checkbox
                      label='Foil' checked={isFoil}
                      onChange={() => toggleFoil(card, tradeIdx)}
                      disabled={(isFoil) ? (!editions[setIdx].prices.usd) : (!editions[setIdx].prices.usd_foil)}
                    />
                  </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                  <Grid.Column>
                    <Dropdown selection fluid text={editions[setIdx].set_name}>
                      <Dropdown.Menu>
                        {
                          editions.map((edition, i) => (
                            <Dropdown.Item value={i} onClick={(e, { value }) => editCardSet(card, tradeIdx, value)}
                              content={<div>
                                {edition.set_name}
                                &nbsp;
                                <i className={`ss ss-2x ss-${edition.set}`} />
                              </div>}
                              selected={editions.setIdx === i}
                            />
                          ))
                        }
                      </Dropdown.Menu>
                    </Dropdown>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            ) : (null)
          }
        </Modal.Content>
      </Modal>
    )
  } else {
    return (<Fragment></Fragment>)
  }
}

export default Overlay
