import Card from '../Card/Card'
import PlaceholderCard from '../PlaceholderCard/PlaceholderCard'
import classes from './selectedCardsSection.module.css'

export default function SelectedCardsSection({ card }) {
  return (
    <section className={classes.section}>
      {card ? (
        <Card
          name={card.name}
          id={card.id}
          description={card.animal.description}
          image={card.pictureUrl}
        />
      ) : (
        <PlaceholderCard text='Select card' />
      )}
    </section>
  )
}
