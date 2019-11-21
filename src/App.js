import React, { useState, useEffect } from 'react'
import { Grid, Search, Modal, Dropdown } from 'semantic-ui-react'
import './App.css'
import './keyrune.css'

import { useTrades } from './useCustom'
import { Card, Overlay } from './components'

function App() {
  const [allCardNames, setAllCardNames] = useState([])
  const [searchResult, setSearchResult] = useState([])
  const [resultCard, setResultCard] = useState(null)
  const [leftTrades, setLeftTrades, addToLeft] = useTrades()
  const [rightTrades, setRightTrades, addToRight] = useTrades()
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

  const editTrade = (isLeft, tradeIdx, setIdx, isFoil) => {
    if (isLeft) {
      const cardCopy = [...leftTrades[tradeIdx]]
      cardCopy.isLeft = isLeft
      cardCopy.tradeIdx = tradeIdx
      cardCopy.setIdx = setIdx
      cardCopy.isFoil = isFoil

      setLeftTrades([
        ...leftTrades.slice(0, tradeIdx),
        cardCopy,
        ...leftTrades.slice(tradeIdx + 1)
      ])
    } else {

    }
  }

  const openOverlay = (editions, isLeft, tradeIdx) => {
    setIsOverlayOpen(true)
    editions.isLeft = isLeft
    editions.tradeIdx = tradeIdx
    setOverlayContent(editions)
  }

  const closeOverlay = () => {
    setIsOverlayOpen(false)
    setOverlayContent([])
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


        <Grid.Row style={{position: 'relative', maxWidth: '100vw'}} className='py-0' columns={2}>
          <Grid.Column className='trade-col px-0'>
            {leftTrades.map((editions, tradeIdx) => (
              <Card editions={editions} tradeIdx={tradeIdx} openOverlay={openOverlay} isLeft={true} />
            ))}
          </Grid.Column>
          <Grid.Column className='trade-col px-0'>
            {rightTrades.map((editions, tradeIdx) => (
              <Card editions={editions} tradeIdx={tradeIdx} openOverlay={openOverlay} isLeft={false} />
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <Overlay editions={overlayContent} isOpen={isOverlayOpen} closeOverlay={closeOverlay} editTrade={editTrade} />
    </div>
  )
}

export default App
