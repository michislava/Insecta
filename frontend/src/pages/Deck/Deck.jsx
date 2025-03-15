import './style.css'

import { useEffect, useState, useMemo } from 'react'

function Modal({ id, cards, closeModal }) {
  const card = useMemo(() => cards.find((c) => c.id === id), [id, cards])

  return (
    <div className='overlay'>
      <div className='content'>
        <p onClick={closeModal}>X</p>
        {card.image}
        {card.description}
        {card.name}
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
            })),
          ),
        ),
      )
      .catch(console.error)
  }, [])
  return (
    <div>
      <h1 className='title'>Your collection 🐛🐛🐛</h1>
      <div className='cardList'>
        {(cards || []).map(({ name, image, description, id }) => (
          <div onClick={() => setFocusedCardId(id)} className='card'>
            <img src={image} alt={name} />
            <p className='cardTitle'>{name}</p>
            <p>{description.slice(0, 20)}</p>
          </div>
        ))}
      </div>
      {focusedCardId && (
        <Modal
          id={focusedCardId}
          cards={cards}
          closeModal={() => setFocusedCardId(undefined)}
        />
      )}
    </div>
  )
}
