import React, { useState, useEffect } from 'react'
import { Grid, Search, Modal } from 'semantic-ui-react'
import './App.css'
import './keyrune.css'

import { useTrades } from './useCustom'
import { Card } from './components'

function App() {
  const [allCardNames, setAllCardNames] = useState([])
  const [searchResult, setSearchResult] = useState([])
  const [resultCard, setResultCard] = useState(null)
  const [leftTrades, addToLeft] = useTrades()
  const [rightTrades, addToRight] = useTrades()
  const [isOverlayOpen, setIsOverlayOpen] = useState(false)
  const [overlayContent, setOverlayContent] = useState([])

  useEffect(() => {
    async function fetchAllCards() {
      const resp = await fetch('https://api.scryfall.com/catalog/card-names')
      const json = await resp.json()

      setAllCardNames(json.data)
    }

    fetchAllCards()
  }, [])

  const handleInputChange = (e, { value }) => {
    setResultCard(null)
    const re = new RegExp(value, 'i')
    setSearchResult(allCardNames.filter(card => re.test(card)).slice(0, 25).map((name, i) => ({ key: i, name, title: name })))
  }

  const addToTrade = (columnName) => {
    if (resultCard) {
      if (columnName === 'left') {
        addToLeft(resultCard.name)
      } else if (columnName === 'right') {
        addToRight(resultCard.name)
      }
    }
  }

  const openOverlay = (editions) => {
    setIsOverlayOpen(true)
  }

  const closeOverlay = () => {
    setIsOverlayOpen(false)
  }

  // console.log('left', leftTrades)
  // console.log('right', rightTrades)

  return (
    <div className='App'>
      <Grid centered>
        <Grid.Row className='header'>
          <h1>Trade Tracker</h1>
        </Grid.Row>

        <Grid.Row style={{backgroundColor: 'green'}}>
          <Search
            onSearchChange={handleInputChange}
            onResultSelect={(e, { result }) => setResultCard(result)}
            results={searchResult}
          />
        </Grid.Row>


        <Grid.Row className='pt-0' columns={2} style={{height: '25px'}}>
          <Grid.Column
            className='p-1 ctr-txt'
            style={{backgroundColor: 'blue'}}
            onClick={() => addToTrade('left')}
          >⏪</Grid.Column>
          <Grid.Column
            className='p-1 ctr-txt'
            style={{backgroundColor: 'red'}}
            onClick={() => addToTrade('right')}
          >⏩</Grid.Column>
        </Grid.Row>


        <Grid.Row style={{position: 'relative'}} className='py-0' columns={2}>
          <Grid.Column className='trade-col pr-0'>
            {leftTrades.map(editions => (
              <Card editions={editions} openOverlay={openOverlay} />
            ))}
          </Grid.Column>
          <Grid.Column className='trade-col pl-0 mr-0'>
            {rightTrades.map(editions => (
              <Card editions={editions} openOverlay={openOverlay} />
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <Modal className='ctr-txt' open={isOverlayOpen} onClose={closeOverlay}>
        <Modal.Content className='vert-ctr-parent'>
          <Grid centered columns={2} className='vert-ctr'>
            <Grid.Row>
              <Grid.Column>
                <div>hi</div>
                <div>hi</div>
              </Grid.Column>
              <Grid.Column>hi2</Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>hi3</Grid.Column>
              <Grid.Column>hi4</Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>
      </Modal>
    </div>
  )
}

export default App
