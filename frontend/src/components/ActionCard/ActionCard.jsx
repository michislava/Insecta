import classes from "./actionCard.module.css";

export default function ActionCard({ img, text }) {
  return (
    <div className={classes.actionCard}>
      <img src={img} alt="insects fighting" />
      <p>{text}</p>
    </div>
  );
}
