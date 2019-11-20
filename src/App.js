import React, { useState, useEffect } from 'react'
import { Grid, Search } from 'semantic-ui-react'
import _ from 'lodash'
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

  console.log('left', leftTrades)
  console.log('right', rightTrades)

  return (
    <div className='App'>
      <Grid centered>
        <Grid.Row centered className='header'>
          <h1>Trade Tracker</h1>
        </Grid.Row>

        <Grid.Row style={{backgroundColor: 'green'}}>
          <Search
            onSearchChange={handleInputChange}
            onResultSelect={(e, { result }) => setResultCard(result)}
            results={searchResult}
          />
        </Grid.Row>

        {
          true ? (
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

        <Grid.Row style={{position: 'relative'}} className='py-0' columns={2}>
          <Grid.Column className='trade-col pr-0'>
            {leftTrades.map(card => (
              <Card card={card} />
            ))}
          </Grid.Column>
          <Grid.Column className='trade-col pl-0 mr-0'>
            {rightTrades.map(card => (
              <Card card={card} />
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  )
}

export default App
