import { useState } from 'react'
import { exampleTrade } from './helpers'

export function useTrades() {
  const [cards, setCards] = useState([...exampleTrade, ...exampleTrade, ...exampleTrade, ...exampleTrade])

  const addCard = cardName => {
    async function fetchCard() {
      const resp = await fetch(`https://api.scryfall.com/cards/search?q="${cardName}"&unique=prints`)
      const json = await resp.json()

      setCards([ ...cards, json.data ])
    }

    fetchCard(cardName)
  }

  return [cards, addCard]
}
