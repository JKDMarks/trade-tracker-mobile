import { useState } from 'react'

export function useTrades() {
  const [cards, setCards] = useState([])

  const addCard = (cardName, isLeft) => {
    async function fetchCard() {
      const resp = await fetch(`https://api.scryfall.com/cards/search?q="${cardName}"&unique=prints`)
      const json = await resp.json()

      const card = { editions: json.data, setIdx: 0, isFoil: false, isLeft }
      setCards([ card, ...cards ])
    }

    fetchCard(cardName)
  }

  return [cards, setCards, addCard]
}
