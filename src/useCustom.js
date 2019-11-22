import { useState } from 'react'

export function useTrades() {
  const [cards, setCards] = useState([])

  const addCard = (cardName, isLeft) => {
    async function fetchCard() {
      const resp = await fetch(`https://api.scryfall.com/cards/search?q="${cardName}"%20-is:digital&unique=prints`)
      const json = await resp.json()

      const card = { editions: json.data, setIdx: 0, isFoil: false, isLeft, quantity: 1 }
      setCards([ card, ...cards ])
    }

    fetchCard(cardName)
  }


  const updateIthCard = (card, idx) => {
    setCards([
      ...cards.slice(0, idx),
      card,
      ...cards.slice(idx + 1)
    ])
  }


  const deleteIthCard = (idx) => {
    setCards([
      ...cards.slice(0, idx),
      ...cards.slice(idx + 1)
    ])
  }


  return [cards, setCards, addCard, updateIthCard, deleteIthCard]
}
