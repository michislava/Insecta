import { useState } from 'react'
import classes from './fight.module.css'

import imgPlaceholder from '../../assets/images/logo_placeholder.png'

export default function FightPage() {
const playersAvailable = [
    {name: 'player1', id:0, img: imgPlaceholder },
    {name: 'player2', id:1, img: imgPlaceholder },
    {name: 'player3', id:2, img: imgPlaceholder }] //placeholder info
const [idPlayerToFight, setIdPlayerToFight] = useState(undefined)

    return (
        <div className={classes.page}>
            <div className={classes.peopleForFightTag}>
                <p>Available people to fight</p>
            </div>
            <div className={classes.avlPplContainer}>
                {(playersAvailable || []).map(({ name, id, img}) => (
                <div onClick={() => setIdPlayerToFight(id)} className={classes.personInList}>
                <img src={img} />
                <p>{name}</p>
                </div>
                ))}
            </div>
            <div className={classes.buttonsDiv}>
                <button onClick= "/home">Go Back</button>
                <button onClick = "/fight/chooseYourDeck">Proceed</button>
            </div>
        </div>
    )
}