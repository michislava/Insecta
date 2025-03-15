import ActionMenu from '../../components/ActionMenu/ActionMenu'
import Card from '../../components/Card/Card'
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
    // @TODO use our endpoint
    fetch('https://api.sampleapis.com/coffee/iced')
      .then((r) =>
        r.json().then((r) =>
          setCards(
            r.map(({ title, description, image }, id) => ({
              name: title,
              description,
              image,
              id,
            }))
          )
        )
      )
      .catch(console.error)
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
