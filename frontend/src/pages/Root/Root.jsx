import classes from './root.module.css'

// TODO: Change to logo
import logo from '../../assets/images/logo.png'

import { Outlet } from 'react-router'

export default function RootPage() {
  return (
    <>
      <Outlet />
      <footer className={classes.footer}>
        <img src={logo} alt='Logo' />
        <a href='https://github.com/michislava/Insecta' target='_blank'>
          <i className='fa-brands fa-github'></i>
        </a>
      </footer>
    </>
  )
}
