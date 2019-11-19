import React, { useState, useEffect } from 'react'
import { Grid, Search } from 'semantic-ui-react'
import _ from 'lodash'
import './App.css'

import { useTrades } from './useCustom'

function App() {
  const [allCards, setAllCards] = useState([])
  const [searchResult, setSearchResult] = useState([])
  const [addCard, setAddCard] = useState(null)
  const [leftTrades, addToLeft] = useTrades()
  const [rightTrades, addToRight] = useTrades()

  useEffect(() => {
    async function fetchAllCards() {
      const resp = await fetch('https://api.scryfall.com/catalog/card-names')
      const json = await resp.json()

      setAllCards(json.data)
    }

    fetchAllCards()
  }, [])

  const handleInputChange = (e, { value }) => {
    setAddCard(null)
    const re = new RegExp(value, 'i')
    setSearchResult(allCards.filter(card => re.test(card)).slice(0, 25).map((name, i) => ({ key: i, name, title: name })))
  }

  const addToTrade = (columnName) => {
    if (columnName === 'left') {
      addToLeft(addCard.name)
    } else if (columnName === 'right') {
      addToRight(addCard.name)
    }
  }

  return (
    <div className='App'>
      <Grid centered>
        <Grid.Row centered className='header'>
          <h1>Trade Tracker</h1>
        </Grid.Row>

        <Grid.Row style={{backgroundColor: 'green'}}>
          <Search
            onSearchChange={handleInputChange}
            onResultSelect={(e, { result }) => setAddCard(result)}
            results={searchResult}
          />
        </Grid.Row>

        {
          addCard ? (
            <Grid.Row className='pt-0' columns={2} style={{height: '25px'}}>
              <Grid.Column
                className='p-1'
                style={{backgroundColor: 'blue', textAlign: 'center'}}
                onClick={() => addToTrade('left')}
              >⏪</Grid.Column>
              <Grid.Column
                className='p-1'
                style={{backgroundColor: 'red', textAlign: 'center'}}
                onClick={() => addToTrade('right')}
              >⏩</Grid.Column>
            </Grid.Row>
          ) : (null)
        }

        <Grid.Row className='py-0' columns={2}>
          <Grid.Column textAlign='center'>
            {
              leftTrades.map(card => <Grid.Row>{card.name}</Grid.Row>)
            }
          </Grid.Column>
          <Grid.Column textAlign='center'>
            {
              rightTrades.map(card => <Grid.Row>{card.name}</Grid.Row>)
            }
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  )
}

export default App
