import classes from "./login.module.css"
import logo from "../../assets/images/logo_placeholder.png"

export default function LoginPage() {
  return (
    <div className={classes.desktopCompatability}>
      <div className={classes.content}>
        <div className={classes.divWithLogo}>
          <img className={classes.logo} src={logo} alt="logo" />
          <p className={classes.projectName}>Insecta</p>
        </div>
        <div className={classes.divWithForm}>
          <button className={classes.googleLoginBtn}>Google Login</button>
          <p className={classes.orParagraph}>or</p>
          <form className={classes.form} action="">
            <input placeholder="Username" className={classes.input} type="text" name="" id=""/>
            <input placeholder="Email" className={classes.input} type="email" name="" id="" />
            <input placeholder="Password" className={classes.input} type="password" name="" id="" />
          </form>
        </div>
      </div>
    </div>
  )
    
}
