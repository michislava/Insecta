import classes from "./actionMenu.module.css";

import { NavLink } from "react-router-dom";

export default function ActionMenu() {
  return (
    <>
      <div className={classes.photoBtn}>
        <i className="fa-solid fa-camera"></i>
      </div>
      <section className={classes.section}>
        <div>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? classes.activeLink : classes.link
            }
          >
            <i className="fa-solid fa-house"></i>
          </NavLink>
          <NavLink
            to="/deck"
            className={({ isActive }) =>
              isActive ? classes.activeLink : classes.link
            }
          >
            <i className="fa-solid fa-bars-staggered"></i>
          </NavLink>
        </div>
        <div>
          <NavLink
            to="/history"
            className={({ isActive }) =>
              isActive ? classes.activeLink : classes.link
            }
          >
            <i className="fa-solid fa-clock-rotate-left"></i>
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? classes.activeLink : classes.link
            }
          >
            <i className="fa-solid fa-user"></i>
          </NavLink>
        </div>
      </section>
    </>
  );
}
