import ActionMenu from '../../components/ActionMenu/ActionMenu'
import Card from '../../components/Card/Card'
import { getCsrfToken } from '../../utils/auth'
import classes from './deck.module.css'

import { useEffect, useState, useMemo } from 'react'

function Modal({ id, cards, closeModal }) {
  const card = useMemo(() => cards.find((c) => c.id === id), [id, cards])

  return (
    <div onClick={closeModal} className={classes.overlay}>
      <div className={classes.content}>
        <img src={card.image} alt='card image' />
        <p>{card.name}</p>
        <textarea name='' id=''>
          {card.description}
        </textarea>
      </div>
    </div>
  )
}

export default function Deck() {
  const [cards, setCards] = useState(undefined)
  const [focusedCardId, setFocusedCardId] = useState(undefined)
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
        {(cards || []).map(({ name, image, description, id }, index) => (
          <Card
            key={index}
            image={image}
            name={name}
            id={id}
            description={description}
            onClick={() => setFocusedCardId(id)}
          />
        ))}
      </div>
      {focusedCardId >= 0 && (
        <Modal
          id={focusedCardId}
          cards={cards}
          closeModal={() => setFocusedCardId(undefined)}
        />
      )}
    </>
  )
}
