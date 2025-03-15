import classes from './card.module.css'

export default function Card({ name, image, id, description, ...props }) {
  return (
    <div {...props} className={classes.card}>
      <img src={image} alt={name} />
      <p className={classes.cardTitle}>{name}</p>
      <p>{description.slice(0, 17)}...</p>
    </div>
  )
}
