import { useParams, useNavigate } from 'react-router-dom'

import { useCallback, useEffect, useMemo, useState } from 'react'

import classes from './trade.module.css'
import Card from '../../components/Card/Card'
import SelectCardModal from '../SelectCardModal/SelectCardModal'

const USER_A_ID = '0d5c6541-e9ae-4c52-b840-45c06a41a489' // buzz
const USER_B_ID = '25f4cb36-1011-451a-b716-3f951b6a387b' // cardi
function EmptyCard({ onClick }) {
  return (
    <div className={`${classes.cardOrdEmpty}`} onClick={onClick}>
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'>
        <path d='M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z' />
      </svg>
    </div>
  )
}

export default function TradePage() {
  const { id } = useParams()
  const [trade, setTrade] = useState(undefined)
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [currentUserCards, setCurrentUserCards] = useState(undefined)
  const tradeStatus = useMemo(() => {
    if (!id) return 'Inactive'
    if (!trade) return 'Loading...'
    if (!id) return 'Inactive'
    if (!trade.cardB) return 'Pending'
    return 'Success'
  }, [id, trade])
  useEffect(() => {
    if (currentUserCards) return
    // @TODO use actual current user card
    fetch(`http://localhost:3000/cards`)
      .then((r) => r.json())
      .then((r) => setCurrentUserCards(r.cards))
      .catch(console.error)
  }, [currentUserCards])

  useEffect(() => {
    if (!id) return
    // we already know it is finalized, no need to start polling
    if (trade && trade.cardB) return
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
        <p className={classes.title}>Trade</p>
        <p className={classes.status}>{tradeStatus}</p>
        <h2>{trade?.userA?.name || 'Your card'}</h2>

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
          <EmptyCard onClick={() => setShowModal(true)} />
        )}
        <hr />
        <h2>{trade?.userB?.name || 'To get'}</h2>
        {trade && trade.cardB ? (
          <Card
            name={trade.cardB.name}
            image={trade.cardB.pictureUrl}
            id={trade.cardB.id}
            description={trade.cardB.animal.description}
          />
        ) : (
          <EmptyCard onClick={() => setShowModal(true)} />
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
