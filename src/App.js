import React, { useState, useEffect } from 'react'
import { Grid, Search } from 'semantic-ui-react'
import './App.css'

import { useTrades } from './useCustom'
import { Card, Overlay } from './components'

import { exampleTrade } from './helpers'

const leftExample = exampleTrade.map(editions => {
  return { editions, setIdx: 0, isFoil: false, isLeft: true, quantity: 1 }
})

const rightExample = exampleTrade.map(editions => {
  return { editions, setIdx: 0, isFoil: false, isLeft: false, quantity: 1 }
})

function App() {
  ////////// useState DECLARATIONS //////////
  const [allCardNames, setAllCardNames] = useState([])
  const [query, setQuery] = useState('')
  const [searchResult, setSearchResult] = useState([])
  const [resultCard, setResultCard] = useState(null)
  const [leftTrades, setLeftTrades, addToLeft, updateIthLeftCard, deleteIthLeftCard] = useTrades()
  const [rightTrades, setRightTrades, addToRight, updateIthRightCard, deleteIthRightCard] = useTrades()
  const [tradePrices, setTradePrices] = useState({ left: 0, right: 0 })
  const [isOverlayOpen, setIsOverlayOpen] = useState(false)
  const [overlayContent, setOverlayContent] = useState({})


  ////////// useEffect BLOCKS //////////
  useEffect(() => {
    async function fetchAllCards() {
      const resp = await fetch('https://api.scryfall.com/catalog/card-names')
      const json = await resp.json()

      setAllCardNames(json.data)
    }

    fetchAllCards()
    setLeftTrades([ ...leftExample, ])
    setRightTrades([ ...rightExample, ])
  }, [])

  useEffect(() => {
    setTradePrices({
      left: tradeSum(leftTrades),
      right: tradeSum(rightTrades)
    })
  }, [leftTrades, rightTrades])


  ////////// GENERAL FUNCTIONS //////////
  const cardPrice = (card) => (card.isFoil) ? (card.editions[card.setIdx].prices.usd_foil) : (card.editions[card.setIdx].prices.usd)

  // const formattedCardPrice = (card) => cardPrice(card).replace(/\d(?=(\d{3})+\.)/g, '$&,')

  const tradeSum = (trade) => {
    if (trade.length > 0) {
      return trade.reduce((sum, card) => {
        return (Number(sum) + Number(cardPrice(card))).toFixed(2)
      }, 0)
    } else {
      return 0
    }
  }

  const tradeDiffStr = () => {
    const diff = (tradePrices.left - tradePrices.right).toFixed(2)

    if (diff > 0) {
      return `⏪ $${diff}`
    } else if (diff < 0) {
      return `$${-diff} ⏩`
    } else {
      return "Even trade"
    }
  }


  ////////// SEARCH FUNCTIONS //////////
  const handleInputChange = (e, { value }) => {
    setResultCard(null)
    setQuery(value)

    // setSearchResult TO ONLY THE FIRST 25 CARDS THAT MATCH THE QUERY
    const re = new RegExp(value, 'i')
    setSearchResult(allCardNames.filter(card => re.test(card)).slice(0, 25).map((name, i) => ({ key: i, name, title: name })))
  }

  const addToTrade = (columnName) => {
    if (resultCard) {
      if (columnName === 'left') {
        addToLeft(resultCard.name, true)
      } else if (columnName === 'right') {
        addToRight(resultCard.name, false)
      }

      setResultCard(null)
      setQuery('')
    }
  }


  ////////// OVERLAY FUNCTION //////////
  const openOverlay = (card, tradeIdx) => {
    setIsOverlayOpen(true)
    setOverlayContent({card, tradeIdx})
  }

  const closeOverlay = () => {
    setIsOverlayOpen(false)
    setOverlayContent({})
  }

  const editCardSet = (card, tradeIdx, setIdx) => {
    const foilVal = (card) => {
      const { editions, setIdx, isFoil } = card
      const prices = editions[setIdx].prices
      if (prices.usd && prices.usd_foil) {
        return isFoil
      } else if (!prices.usd) {
        return true
      } else if (!prices.usd_foil) {
        return false
      }
    }

    if (card.isLeft) {
      const cardCopy = { ...leftTrades[tradeIdx], setIdx }
      cardCopy.isFoil = foilVal(cardCopy)
      updateIthLeftCard(cardCopy, tradeIdx)
      setOverlayContent({ card: cardCopy, tradeIdx })
    } else {
      const cardCopy = { ...rightTrades[tradeIdx], setIdx }
      cardCopy.isFoil = foilVal(cardCopy)
      updateIthRightCard(cardCopy, tradeIdx)
      setOverlayContent({ card: cardCopy, tradeIdx })
    }
  }

  const toggleFoil = (card, tradeIdx) => {
    if (card.isLeft) {
      const cardCopy = { ...leftTrades[tradeIdx] }
      cardCopy.isFoil = !cardCopy.isFoil
      updateIthLeftCard(cardCopy, tradeIdx)
      setOverlayContent({ card: cardCopy, tradeIdx })
    } else {
      const cardCopy = { ...rightTrades[tradeIdx] }
      cardCopy.isFoil = !cardCopy.isFoil
      updateIthRightCard(cardCopy, tradeIdx)
      setOverlayContent({ card: cardCopy, tradeIdx })
    }
  }


  const deleteFromTrade = (isLeft, tradeIdx) => {
    if (isLeft) {
      deleteIthLeftCard(tradeIdx)
    } else {
      deleteIthRightCard(tradeIdx)
    }

    setIsOverlayOpen(false)
    setOverlayContent({})
  }

  ////////// JSX //////////
  return (
    <div className='App'>
      <Grid centered>
        <Grid.Row className='header'>
          <h1>Trade Tracker</h1>
        </Grid.Row>

        <Grid.Row style={{backgroundColor: 'green'}}>
          <Search
            onSearchChange={handleInputChange}
            onResultSelect={(e, { result }) => {setResultCard(result); setQuery(result.name);}}
            results={searchResult}
            value={query}
          />
        </Grid.Row>

        <Grid.Row className='pt-0' columns={2} style={{height: '25px'}}>
          <Grid.Column
            className='p-1 ctr-txt'
            style={{backgroundColor: 'blue'}}
            onClick={() => addToTrade('left')}
          ><span role='img' aria-label='left-arrow'>⏪</span></Grid.Column>
          <Grid.Column
            className='p-1 ctr-txt'
            style={{backgroundColor: 'red'}}
            onClick={() => addToTrade('right')}
          ><span role='img' aria-label='right-arrow'>⏩</span></Grid.Column>
        </Grid.Row>

        <Grid.Row style={{position: 'relative'}} className='py-0' columns={2}>
          <Grid.Column className='trade-col px-0'>
            {leftTrades.map((card, tradeIdx) => (
              <Card
                key={`left-${tradeIdx}`}
                card={card} tradeIdx={tradeIdx} isLeft={true}
                openOverlay={openOverlay}
                cardPrice={cardPrice}
              />
            ))}
          </Grid.Column>
          <Grid.Column className='trade-col px-0'>
            {rightTrades.map((card, tradeIdx) => (
              <Card
                key={`right-${tradeIdx}`}
                card={card} tradeIdx={tradeIdx} isLeft={false}
                openOverlay={openOverlay}
                cardPrice={cardPrice}
              />
            ))}
          </Grid.Column>
        </Grid.Row>

        <Grid.Row centered className='p-0 price-col' columns={0} style={{height: '35px', position: 'fixed', bottom: '35px', width: '100vw', backgroundColor: 'green'}}>
          <div className='vert-ctr-parent'>
            <div className='vert-ctr'>
              {tradeDiffStr()}
            </div>
          </div>
        </Grid.Row>

        <Grid.Row centered className='p-0' columns={2} style={{height: '35px', position: 'fixed', bottom: '0', width: '100vw'}}>
          <Grid.Column className='ctr-txt price-col' style={{backgroundColor: 'blue'}}>
            <div className='vert-ctr-parent'>
              <div className='vert-ctr'>
                ${tradePrices.left}
              </div>
            </div>
          </Grid.Column>
          <Grid.Column className='ctr-txt price-col' style={{backgroundColor: 'red'}}>
            <div className='vert-ctr-parent'>
              <div className='vert-ctr'>
                ${tradePrices.right}
              </div>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <Overlay
        card={overlayContent.card}
        tradeIdx={overlayContent.tradeIdx}
        cardPrice={cardPrice}
        isOpen={isOverlayOpen}
        closeOverlay={closeOverlay}
        editCardSet={editCardSet}
        toggleFoil={toggleFoil}
        deleteFromTrade={deleteFromTrade}
      />
    </div>
  )
}

export default App
