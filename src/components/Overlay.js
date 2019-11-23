import React, { Fragment } from 'react'
import { Modal, Grid, Dropdown, Checkbox, Button } from 'semantic-ui-react'

function Overlay({ card, tradeIdx, cardPrice, isOpen, closeOverlay, editCardSet, editCardQuantity, toggleFoil, deleteFromTrade }) {
  if (card && Object.entries(card).length > 0) {
    const { editions, setIdx, isFoil, isLeft, quantity } = card
    console.log(setIdx, isFoil, isLeft, tradeIdx)

    return (
      <Modal className='ctr-txt' open={isOpen} onClose={closeOverlay}>
        <Modal.Content className='vert-ctr-parent'>
          {
            (editions && editions.length > 0) ? (
              <Grid centered className='vert-ctr'>
                <Grid.Row>
                  <Grid.Column textAlign='center'>
                    Card Price: ${cardPrice(card)}
                  </Grid.Column>
                </Grid.Row>

                <Grid.Row columns={2}>
                  <Grid.Column textAlign='center'>
                    <label style={{maxWidth: '100%'}}>
                      <input
                        type='number' value={quantity}
                        className='m-0' style={{maxWidth: '15%'}}
                        onChange={(e) => editCardQuantity(card, e.target.value)}
                      />
                      &nbsp; Quantity
                    </label>
                  </Grid.Column>

                  <Grid.Column textAlign='center'>
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

                <Grid.Row>
                  <Grid.Column textAlign='center'>
                    <Button
                      color='red' content='Delete From Trade'
                      onClick={() => {
                        const confirmDelete = window.confirm('Delete this card?')
                        if (confirmDelete) {
                          deleteFromTrade(isLeft, tradeIdx)
                        }
                      }}
                    />
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
