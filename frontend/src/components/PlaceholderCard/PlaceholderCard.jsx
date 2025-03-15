import Balatro from '../../blocks/Backgrounds/Balatro/Balatro'
import classes from './placeholderCard.module.css'

export default function PlaceholderCard({ text = '' }) {
  return (
    <div className={classes.container}>
      <p>Select card</p>
      <Balatro isRotate={false} mouseInteraction={false} pixelFilter={1000} />
    </div>
  )
}
