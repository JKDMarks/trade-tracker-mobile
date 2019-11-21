import { useState } from 'react'
import { exampleTrade } from './helpers'

exampleTrade.forEach(editions => {
  editions.setIdx = 0
  editions.isFoil = false
  // cardEditions.forEach(ed => {
  //   debugger
  // })
})

export function useTrades() {
  const [cards, setCards] = useState([...exampleTrade, ...exampleTrade, ...exampleTrade, ...exampleTrade])

  const addCard = cardName => {
    async function fetchCard() {
      const resp = await fetch(`https://api.scryfall.com/cards/search?q="${cardName}"&unique=prints`)
      const json = await resp.json()
      json.data.setIdx = 0
      json.data.isFoil = false

      setCards([ json.data, ...cards ])
    }

    fetchCard(cardName)
  }

  return [cards, setCards, addCard]
}
