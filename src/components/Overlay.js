import React from 'react'
import { Modal, Grid, Dropdown } from 'semantic-ui-react'

function Overlay({ editions, isOpen, closeOverlay, editTrade }) {
  const { setIdx, isFoil, isLeft, tradeIdx } = editions

  console.log(setIdx, isFoil, isLeft, tradeIdx)

  return (
    <Modal className='ctr-txt' open={isOpen} onClose={closeOverlay}>
      <Modal.Content className='vert-ctr-parent'>
        {
          (editions.length > 0) ? (
            <Grid centered columns={1} className='vert-ctr'>
              <Grid.Row>
                <Grid.Column>
                  <Dropdown selection style={{width: '100%'}} text={editions[setIdx].set_name}>
                    <Dropdown.Menu>
                      {
                        editions.map((edition, i) => (
                          <Dropdown.Item value={i} onClick={(e, { value }) => editTrade(isLeft, tradeIdx, value, isFoil)}
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
                <Grid.Column>hi3</Grid.Column>
              </Grid.Row>
            </Grid>
          ) : (null)
        }
      </Modal.Content>
    </Modal>
  )
}

export default Overlay
