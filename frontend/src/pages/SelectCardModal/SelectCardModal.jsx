import classes from './selectCardModal.module.css'
import Card from '../../components/Card/Card'

export default function SelectCardModal({ onSelect, cards }) {
  return (
    <div className={classes.overlay}>
      <div className={classes.modal}>
        <h1 className={classes.heading}>Select card for trade</h1>
        {(cards || []).map((card) => (
          <div
            onClick={() => {
              onSelect && onSelect(card)
            }}
          >
            <Card
              key={card.id}
              name={card.animal.name}
              image={card.pictureUrl}
              id={card.id}
              description={card.animal.description}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
