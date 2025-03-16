import ActionMenu from '../../components/ActionMenu/ActionMenu'
import Card from '../../components/Card/Card'
import { getCsrfToken } from '../../utils/auth'
import classes from './deck.module.css'

import { useEffect, useState, useMemo } from 'react'

function Modal({ card, ...props }) {
  return (
    <div {...props} className={classes.overlay}>
      <div className={classes.content}>
        <img src={card.pictureUrl} alt='card image' />
        <p>{card.animal.name}</p>
        <textarea value={card.animal.description} />
      </div>
    </div>
  )
}

export default function Deck() {
  const [cards, setCards] = useState(undefined)
  const [focusedCard, setFocusedCard] = useState(undefined)
  useEffect(() => {
    async function fetchCards() {
      const response = await fetch('http://localhost:3000/cards', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCsrfToken(),
        },
      })

      const responseData = await response.json()
      console.log(responseData)
      setCards(responseData.cards)
    }

    fetchCards()
  }, [])
  return (
    <>
      <ActionMenu />
      <h1 className={classes.title}>Your collection</h1>
      <div className={classes.cardList}>
        {(cards || []).map((card) => (
          <Card
            key={card.id}
            image={card.pictureUrl}
            name={card.name}
            id={card.id}
            description={card.animal.description}
            onClick={() => setFocusedCard(card)}
          />
        ))}
      </div>
      {focusedCard && (
        <Modal card={focusedCard} onClick={() => setFocusedCard(undefined)} />
      )}
    </>
  )
}
