import { useParams, useNavigate } from 'react-router-dom'

import { useCallback, useEffect, useState } from 'react'

import classes from './trade.module.css'
import Card from '../../components/Card/Card'
import SelectCardModal from '../SelectCardModal/SelectCardModal'

const USER_A_ID = '1d38f28c-e7b1-4d04-8c16-7746921221c6' // buzz
const USER_B_ID = 'c45a5c80-b0dd-4605-9009-679e4c00ea5e' // cardi

export default function TradePage() {
  const { id } = useParams()
  const [trade, setTrade] = useState(undefined)
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [currentUserCards, setCurrentUserCards] = useState(undefined)
  useEffect(() => {
    if (currentUserCards) return
    // @TODO use actual current user card
    fetch(`http://localhost:3000/cards/${USER_A_ID}`)
      .then((r) => r.json())
      .then((r) => setCurrentUserCards(r.cards))
      .catch(console.error)
  }, [currentUserCards])

  useEffect(() => {
    if (!id) return
    // we already know it is finalized, no need to start polling
    if (trade && trade.cardB) return
    console.log(1)
    if (!trade)
      fetch(`http://localhost:3000/trade/${id}`)
        .then((r) => r.json())
        .then((r) => r && setTrade(r.trade))
        .catch(console.error)

    // polling is when we wait for the other party to exchange something
    const interval = setInterval(
      () =>
        fetch(`http://localhost:3000/trade/${id}`)
          .then((r) => r.json())
          .then((r) => r && setTrade(r.trade))
          .catch(console.error),
      5000
    )
    return () => clearInterval(interval)
  }, [trade, id])

  const createTrade = useCallback(
    async (card) => {
      if (!card) return console.log('no card')
      console.log('to create traded', card)
      const response = await fetch(
        // @TODO use current user id
        `http://localhost:3000/create-trade/${USER_A_ID}/${card.id}`,
        { method: 'POST' }
      )
        .then((r) => r.json())
        .catch((e) => console.log(e.message))
      if (!response?.trade?.id) return console.log('failed to create trade')
      await navigate(`/trade/${response.trade.id}`)
    },
    [navigate]
  )

  const finalizeTrade = useCallback(
    async (card) => {
      if (!card) return console.log('no card')
      if (!trade) return console.log('no trade')
      console.log('to fulfil trade', card)
      const newTrade = await fetch(
        // @TODO use current user id
        `http://localhost:3000/finalize-trade/${trade.id}/${USER_B_ID}/${card.id}`,
        { method: 'POST' }
      )
        .then((r) => r.json())
        .catch((e) => console.log(e.message))
      if (!newTrade?.id) return
      await navigate(`/trade/${newTrade.id}`)
    },
    [navigate, trade]
  )

  const onCardSelected = useCallback(
    async (card) => {
      console.log(trade)
      if (!trade?.cardA) return await createTrade(card)
      if (!trade?.cardB) return await finalizeTrade(card)
    },
    [createTrade, finalizeTrade, trade]
  )
  return (
    <>
      <div className={classes.page}>
        <h1>Trade</h1>
        <h2>Your card</h2>
        {trade && trade.cardA ? (
          <>
            <Card
              name={trade.cardA.name}
              image={trade.cardA.pictureUrl}
              id={trade.cardA.id}
              description={trade.cardA.animal.description}
            />
          </>
        ) : (
          // @TODO use component
          <div
            className={`${classes.cardOrdEmpty}`}
            onClick={() => setShowModal(true)}
          />
        )}
        <hr />
        <h2>To get</h2>
        {trade && trade.cardB ? (
          <Card
            name={trade.cardB.name}
            image={trade.cardB.pictureUrl}
            id={trade.cardB.id}
            description={trade.cardB.animal.description}
          />
        ) : (
          <div
            className={`${classes.cardOrdEmpty}`}
            onClick={() => setShowModal(true)}
          />
        )}
      </div>

      {showModal && (
        <SelectCardModal
          cards={currentUserCards}
          onSelect={(card) => {
            onCardSelected(card)
            setShowModal(false)
          }}
        />
      )}
    </>
  )
}
