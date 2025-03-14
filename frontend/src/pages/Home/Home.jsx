import homeHeroImg from "../../assets/images/home-hero.png";
import fightingImg from "../../assets/images/fighting.png";
import cardsImg from "../../assets/images/cards.png";

import ActionCard from "../../components/ActionCard/ActionCard";
import classes from "./home.module.css";

import Aurora from "../../blocks/Backgrounds/Aurora/Aurora";

export default function HomePage() {
  return (
    <>
      <Aurora
        colorStops={["#007074", "#F38C79", "#FFC1B4"]}
        blend={0.5}
        amplitude={1.0}
        speed={0.5}
      />
      <header className={classes.header}>
        <div className={classes.heroText}>
          <h1>Insecta</h1>
          <p>The Ultimate Insect Showdown.</p>
        </div>
        <img className={classes.img} src={homeHeroImg} />
      </header>
      <section className={classes.actionCards}>
        <ActionCard img={fightingImg} text="Fight" />
        <ActionCard img={cardsImg} text="Trade" />
      </section>
    </>
  );
}
