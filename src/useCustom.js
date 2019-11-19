import { useState } from 'react'

export function useTrades() {
  const [cards, setCards] = useState([])

  const addCard = cardName => {
    async function fetchCard() {
      const resp = await fetch(`https://api.scryfall.com/cards/search?q="${cardName}"`)
      const json = await resp.json()

      setCards([ ...cards, json.data[0] ])
    }

    fetchCard(cardName)
  }

  return [cards, addCard]
}
