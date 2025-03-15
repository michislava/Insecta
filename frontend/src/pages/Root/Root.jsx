import classes from "./root.module.css";

// TODO: Change to logo
import beeImg from "../../assets/images/home-hero.png";

import { Outlet } from "react-router";

export default function RootPage() {
  return (
    <>
      <Outlet />
      <footer className={classes.footer}>
        <img src={beeImg} alt="Logo" />
        <i className="fa-brands fa-github"></i>
      </footer>
    </>
  );
}
