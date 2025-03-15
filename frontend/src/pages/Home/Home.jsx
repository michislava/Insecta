import { useNavigate } from 'react-router-dom'
import homeHeroImg from '../../assets/images/home-hero.png'
import fightingImg from '../../assets/images/fighting.png'
import cardsImg from '../../assets/images/cards.png'

import ActionCard from '../../components/ActionCard/ActionCard'
import classes from './home.module.css'

import Aurora from '../../blocks/Backgrounds/Aurora/Aurora'
import ActionMenu from '../../components/ActionMenu/ActionMenu'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <>
      <Aurora
        colorStops={['#007074', '#F38C79', '#FFC1B4']}
        blend={0.5}
        amplitude={1.0}
        speed={0.5}
      />
      <ActionMenu />
      <header className={classes.header}>
        <div className={classes.heroText}>
          <h1>Insecta</h1>
          <p>The Ultimate Insect Showdown.</p>
        </div>
        <h1 onClick={() => navigate('/shoot')}>Take a picture now</h1>
        <img className={classes.img} src={homeHeroImg} />
      </header>
      <section className={classes.actionCards}>
        <ActionCard img={fightingImg} text='Fight' />
        <ActionCard img={cardsImg} text='Trade' />
      </section>
    </>
  )
}
