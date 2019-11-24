import React, { useState, useEffect } from 'react'
import { Grid, Button, Search } from 'semantic-ui-react'
import './App.css'
import uuid from 'uuid'

import { useTrades } from './useCustom'
import { Card, Overlay } from './components'

// import { exampleTrade } from './helpers'
//
// const leftExample = exampleTrade.map(editions => {
//   return { id: uuid(), editions, setIdx: 0, isFoil: false, isLeft: true, quantity: 1 }
// })
//
// const rightExample = exampleTrade.map(editions => {
//   return { id: uuid(), editions, setIdx: 0, isFoil: false, isLeft: false, quantity: 1 }
// })

function App() {
  ////////// useState DECLARATIONS //////////
  const [allCardNames, setAllCardNames] = useState([])  // LIST OF ALL CARD NAMES
  const [query, setQuery] = useState('')                // INPUT IN SEARCH BAR
  const [searchResult, setSearchResult] = useState([])  // LIST OF ALL CARD NAMES THAT MATCH query
  const [resultCard, setResultCard] = useState(null)    // FINAL, EXACT CARD NAME RETURNED FROM SEARCH

  const [trades, setTrades, addToTrades, updateCard, deleteCard] = useTrades()  // ALL CARDS IN THE TRADE (BOTH COLS.)
  const [leftTrades, setLeftTrades] = useTrades([])     // CARDS IN LEFT COL ONLY, TECHNICALLY FAILS SSoT, BUT NEVER UPDATED DIRECTLY
  const [rightTrades, setRightTrades] = useTrades([])   // CARDS IN RIGHT COL. ONLY

  const [tradePrices, setTradePrices] = useState({ left: 0, right: 0 })

  const [isOverlayOpen, setIsOverlayOpen] = useState(false)
  const [isOverlayAdding, setIsOverlayAdding] = useState(true) // true IF ADDING A CARD, false IF EDITING A CARD
  const [overlayCard, setOverlayCard] = useState({})


  ////////// useEffect BLOCKS //////////
  // FETCH CARD NAMES WHEN APP MOUNTS
  useEffect(() => {
    async function fetchAllCards() {
      const resp = await fetch('https://api.scryfall.com/catalog/card-names')
      const json = await resp.json()

      setAllCardNames(json.data)
    }

    fetchAllCards()
    // setTrades([ ...leftExample, ...rightExample, ])
  }, [])

  // UPDATE LEFT & RIGHT WHENEVER trades CHANGES, TECHNICALLY FAILS SSoT
  useEffect(() => {
    setLeftTrades(trades.filter(card => card.isLeft))
    setRightTrades(trades.filter(card => !card.isLeft))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trades])

  // UPDATE PRICES WHENEVER trades CHANGES
  useEffect(() => {
    const tradeSum = (trade) => {
      if (trade.length > 0) {
        return trade.reduce((sum, card) => {
          return (Number(sum) + Number(cardPrice(card)) * card.quantity).toFixed(2)
        }, 0)
      } else {
        return 0
      }
    }

    setTradePrices({
      left: Number(tradeSum(leftTrades)).toFixed(2),
      right: Number(tradeSum(rightTrades)).toFixed(2)
    })
  }, [leftTrades, rightTrades])

  // UPDATES CARD IN OVERLAY WHENEVER trades CHANGES
  useEffect(() => {
    if (isOverlayOpen) {
      const changedCard = trades.find(card => card.id === overlayCard.id)
      setOverlayCard(changedCard)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trades])


  ////////// GENERAL FUNCTIONS //////////
  const cardPrice = (card) => (card.isFoil) ? (card.editions[card.setIdx].prices.usd_foil) : (card.editions[card.setIdx].prices.usd)

  const findCard = (card) => trades.find(findCard => findCard.id === card.id)

  // const formattedCardPrice = (card) => cardPrice(card).replace(/\d(?=(\d{3})+\.)/g, '$&,')

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


  ////////// SEARCHBAR FUNCTIONS //////////
  const handleInputChange = (e, { value }) => {
    setResultCard(null)
    setQuery(value)

    // setSearchResult TO ONLY THE FIRST 25 CARDS THAT MATCH THE QUERY
    const re = new RegExp(value, 'i')
    setSearchResult(allCardNames.filter(card => re.test(card)).slice(0, 25).map((name, i) => ({ key: i, name, title: name })))
  }

  const handleResultSelect = (e, { result: {name} }) => {
    setResultCard(name)
    setQuery(name)

    async function fetchCard() {
      const resp = await fetch(`https://api.scryfall.com/cards/search?q="${name}"%20-is:digital%20(is:funny%20OR%20-is:funny)&unique=prints`)
      const json = await resp.json()
      const card = { id: uuid(), editions: json.data, setIdx: 0, isFoil: false, quantity: 1 }

      setIsOverlayOpen(true)
      setIsOverlayAdding(true)
      setOverlayCard(card)
      // const card = { id: uuid(), editions: json.data, setIdx: 0, isFoil: false, isLeft, quantity: 1 }
      // setCards([ card, ...cards ])
    }

    fetchCard()
  }

  // const addToTrade = (columnName) => {
  //   if (resultCard) {
  //     // SECOND ARG OF addToTrades IS isLeft, I.E. TRUE IF IN LEFT COL. AND V.V.
  //     if (columnName === 'left') {
  //       addToTrades(resultCard, true)
  //     } else if (columnName === 'right') {
  //       addToTrades(resultCard, false)
  //     }
  //
  //     setResultCard(null)
  //     setQuery('')
  //   }
  // }


  ////////// OVERLAY FUNCTION //////////
  const openOverlay = (card, isAdding) => {
    setIsOverlayOpen(true)
    setOverlayCard(card)
    setIsOverlayAdding(isAdding)
  }

  const closeOverlay = () => {
    setIsOverlayOpen(false)
    setOverlayCard({})
    setQuery('')
  }

  // DETERMINES DEFAULT FOIL VALUE OF CARD
  // IF EDITION HAS BOTH FOIL AND NONFOIL VERSIONS, RETURNS INPUT isFoil VALUE
  // ELSE IF EDITION DOESN'T HAVE ONE OF THE TWO, RETURNS WHAT IT CAN BE
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

  const editCardSet = (card, setIdx) => {
    if (isOverlayAdding) {
      const overlayCardCopy = { ...overlayCard, setIdx }
      overlayCardCopy.isFoil = foilVal(overlayCardCopy)
      setOverlayCard(overlayCardCopy)
    } else {
      const cardCopy = { ...findCard(card), setIdx }
      cardCopy.isFoil = foilVal(cardCopy)
      updateCard(cardCopy)
    }
  }

  const editCardQuantity = (card, quantity) => {
    quantity = Number(quantity)
    if (quantity >= 0) {
      if (isOverlayAdding) {
        const overlayCardCopy = { ...overlayCard, quantity }
        setOverlayCard(overlayCardCopy)
      } else {
        const cardCopy = { ...findCard(card), quantity }
        updateCard(cardCopy)
      }
    }
  }

  const toggleFoil = (card) => {
    if (isOverlayAdding) {
      const overlayCardCopy = { ...overlayCard, isFoil: !overlayCard.isFoil }
      setOverlayCard(overlayCardCopy)
    } else {
      const cardCopy = { ...findCard(card), isFoil: !card.isFoil }
      // cardCopy.isFoil = !cardCopy.isFoil
      updateCard(cardCopy)
    }
  }

  const addToTrade = (isLeft) => {
    const overlayCardCopy = { ...overlayCard, isLeft }
    setTrades([ overlayCardCopy, ...trades ])
    closeOverlay()
  }

  const deleteFromTrade = (card) => {
    deleteCard(card)
    setIsOverlayOpen(false)
    setOverlayCard({})
  }


  ////////// JSX //////////
  return (
    <div className='App'>
      <Grid centered>
        <Grid.Row centered className='header'>
          <Grid.Column width={2} className='vert-ctr-parent'>
            <Button
              content='X'
              color='red'
              className='p-0 m-0 vert-ctr'
              style={{width: '15px', height: '15px'}}
              onClick={() => {
                const confirmClear = window.confirm('Clear this trade?')

                if (confirmClear) {
                  setTrades([])
                }
              }}
            />
          </Grid.Column>
          <Grid.Column width={12} textAlign='center'>
            <h1>Trade Tracker</h1>
          </Grid.Column>
          <Grid.Column width={2}>
            {/*
              // 'INFO ABOUT APP AND ME'
              <Button
                content='ℹ'
                color='blue'
                className='p-0 m-0 vert-ctr'
                style={{width: '15px', height: '15px'}}
                onClick={() => console.log('hi')}
                />
            */}
          </Grid.Column>
        </Grid.Row>

        <Grid.Row style={{backgroundColor: '#555555'}}>
          <Search
            onSearchChange={handleInputChange}
            onResultSelect={handleResultSelect}
            results={searchResult}
            value={query}
          />
        </Grid.Row>

        {/*
          <Grid.Row className='p-0' columns={2} style={{height: '35px'}} verticalAlign='middle'>
            <Grid.Column
              className='p-1 ctr-txt vert-ctr-parent'
              style={{backgroundColor: 'blue', height: '100%'}}
              onClick={() => addToTrade('left')}
            ><span className='vert-ctr' style={{left: '0'}} role='img' aria-label='left-arrow'>➕</span></Grid.Column>
            <Grid.Column
              className='p-1 ctr-txt vert-ctr-parent'
              style={{backgroundColor: 'red', height: '100%'}}
              onClick={() => addToTrade('right')}
            ><span className='vert-ctr' style={{left: '0'}} role='img' aria-label='right-arrow'>➕</span></Grid.Column>
          </Grid.Row>
        */}

        <Grid.Row centered className='p-0 price-col' columns={1} style={{height: '35px', width: '100vw', backgroundColor: 'lightgreen'}}>
          <div className='vert-ctr-parent'>
            <div className='vert-ctr'>
              {tradeDiffStr()}
            </div>
          </div>
        </Grid.Row>

        <Grid.Row centered className='p-0' columns={2} style={{height: '35px', width: '100vw'}}>
          <Grid.Column className='ctr-txt price-col' style={{backgroundColor: 'lightblue', height: '100%'}}>
            <div className='vert-ctr-parent'>
              <div className='vert-ctr'>
                ${tradePrices.left}
              </div>
            </div>
          </Grid.Column>
          <Grid.Column className='ctr-txt price-col' style={{backgroundColor: 'pink', height: '100%'}}>
            <div className='vert-ctr-parent'>
              <div className='vert-ctr'>
                ${tradePrices.right}
              </div>
            </div>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row style={{position: 'relative'}} className='py-0' columns={2}>
          <Grid.Column className='trade-col px-0' style={{borderLeft: '3px solid rgba(0,0,0,.1)'}}>
            {leftTrades.map((card) => (
              <Card
                key={card.id}
                card={card} isLeft={true}
                openOverlay={openOverlay}
                cardPrice={cardPrice}
              />
            ))}
          </Grid.Column>
          <Grid.Column className='trade-col px-0'>
            {rightTrades.map((card) => (
              <Card
                key={card.id}
                card={card} isLeft={false}
                openOverlay={openOverlay}
                cardPrice={cardPrice}
              />
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <Overlay
        card={overlayCard}
        isAdding={isOverlayAdding}
        cardPrice={cardPrice}
        isOpen={isOverlayOpen}
        closeOverlay={closeOverlay}
        editCardSet={editCardSet}
        editCardQuantity={editCardQuantity}
        toggleFoil={toggleFoil}
        addToTrade={addToTrade}
        deleteFromTrade={deleteFromTrade}
      />
    </div>
  )
}

export default App
