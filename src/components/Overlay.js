import React, { Fragment } from 'react'
import { Modal, Grid, Dropdown, Checkbox, Button } from 'semantic-ui-react'

function Overlay({ card, cardPrice, isOpen, closeOverlay, editCardSet, editCardQuantity, toggleFoil, deleteFromTrade }) {
  if (card && Object.entries(card).length > 0) {
    const { editions, setIdx, isFoil, quantity } = card
    // console.log(setIdx, isFoil, isLeft)

    return (
      <Modal className='ctr-txt' open={isOpen} onClose={closeOverlay}>
        <Modal.Content className='vert-ctr-parent'>
          {
            (editions && editions.length > 0) ? (
              <Grid centered className='vert-ctr'>
                <Grid.Row>
                  <Grid.Column textAlign='center'>
                    <u>{card.editions[setIdx].name}</u>
                  </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                  <Grid.Column textAlign='center'>
                    Price Per Card: ${cardPrice(card)}
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
                    <div className='vert-ctr-parent'>
                      <div className='vert-ctr'>
                        <Checkbox
                          label='Foil' checked={isFoil}
                          onChange={() => toggleFoil(card)}
                          disabled={(isFoil) ? (!editions[setIdx].prices.usd) : (!editions[setIdx].prices.usd_foil)}
                        />
                      </div>
                    </div>
                  </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                  <Grid.Column>
                    <Dropdown className='selection' fluid text={editions[setIdx].set_name}>
                      <Dropdown.Menu>
                        {
                          editions.map((edition, i) => (
                            <Dropdown.Item key={i} value={i} onClick={(e, { value }) => editCardSet(card, value)}
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
                          deleteFromTrade(card)
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
