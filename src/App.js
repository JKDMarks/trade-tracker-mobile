import React, { useState, useEffect } from 'react'
import './App.css'

import _ from 'lodash'
import { Grid, Search } from 'semantic-ui-react'

function App() {
  const [allCards, setAllCards] = useState([])
  const [searchCards, setSearchCards] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function fetchAllCards() {
      const resp = await fetch('https://api.scryfall.com/catalog/card-names')
      const json = await resp.json()

      setAllCards(json.data)
    }

    fetchAllCards()
  }, [])

  const handleInputChange = (e, { value }) => {
    setIsLoading(true)
    const re = new RegExp(value, 'i')
    setSearchCards(allCards.filter(card => re.test(card)).slice(0, 5).map(name => ({ name })))
    setIsLoading(false)
  }

  return (
    <div className='App'>
      <Grid centered>
        <Grid.Row centered className='header'>
          <h1>Trade Tracker</h1>
        </Grid.Row>

        <Grid.Row style={{backgroundColor: 'green'}}>
          <Search
            onSearchChange={_.debounce(handleInputChange, 1000)}
            results={searchCards}
            resultRenderer={card => <p>{card.name}</p>}
            loading={isLoading}
          />
        </Grid.Row>

        <Grid.Row className='pt-0' columns={2} style={{height: '25px'}}>
          <Grid.Column className='p-1' style={{backgroundColor: 'blue', textAlign: 'center'}}>⏪</Grid.Column>
          <Grid.Column className='p-1' style={{backgroundColor: 'red', textAlign: 'center'}}>⏩</Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  )
}

export default App
