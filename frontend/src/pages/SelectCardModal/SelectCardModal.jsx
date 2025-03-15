import { useState } from 'react'
import SelectedCardsSection from '../../components/SelectedCardsSection/SelectedCardsSection'
import classes from './selectCardModal.module.css'
import Card from '../../components/Card/Card'

const HARDCODED_ANIMALS = {
  bee: {
    id: 'bee',
    name: 'Bee specialicus',
    description: 'Very bzzzz',
    animalClass: 'INSECTA',
    wiki: 'https://www.wikiwand.com/en/articles/Bee',
  },
  butterfly: {
    id: 'butterfly',
    name: 'Butterfly wowicus',
    description: 'Very wow',
    animalClass: 'INSECTA',
    wiki: 'https://www.wikiwand.com/en/articles/Butterfly',
  },
  ant: {
    id: 'ant',
    name: 'Anticus smalikus',
    description: 'Very smol',
    animalClass: 'INSECTA',
    wiki: 'https://www.wikiwand.com/en/articles/Ant',
  },
  dragonfly: {
    id: 'dragonfly',
    name: 'dracarys',
    description: 'Very fly',
    animalClass: 'INSECTA',
    wiki: 'https://www.wikiwand.com/en/articles/dragonfly',
  },
  ladybug: {
    id: 'ladybug',
    name: 'Ladius bugas',
    description: 'Red',
    animalClass: 'INSECTA',
    wiki: 'https://www.wikiwand.com/en/articles/ladybug',
  },
  grasshopper: {
    id: 'grasshopper',
    name: 'grasshop',
    description: 'Green? Sometimes',
    animalClass: 'INSECTA',
    wiki: 'https://www.wikiwand.com/en/articles/grasshopper',
  },
}
const HARDCODED_CARDS = [
  {
    id: 'bee1',
    latitude: 42.697708,
    longitude: 23.321867,
    pictureUrl:
      'https://media.istockphoto.com/id/1416170341/photo/bee.jpg?s=612x612&w=0&k=20&c=ulq9ad3TM-gZRml3jRECrEXB_-8QhmykZ0-Ys0oAqqg=',
    rarity: 'RARE',
    obtainmentDate: '2025-03-15T10:45:48.888Z',
    animalId: 'bee',
    animal: HARDCODED_ANIMALS.bee,
    status: 'discovered',
  },
  {
    id: 'bee2',
    latitude: 42.697708,
    longitude: 23.321867,
    pictureUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Apis_mellifera_Western_honey_bee.jpg/800px-Apis_mellifera_Western_honey_bee.jpg',
    rarity: 'RARE',
    obtainmentDate: '2025-03-15T10:45:48.888Z',
    animalId: 'bee',
    animal: HARDCODED_ANIMALS.bee,
    status: 'traded',
  },
  {
    id: 'butterfly1',
    latitude: 42.597708,
    longitude: 23.421867,
    pictureUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Apis_mellifera_Western_honey_bee.jpg/800px-Apis_mellifera_Western_honey_bee.jpg',
    rarity: 'LEGENDARY',
    obtainmentDate: '2025-03-15T10:45:48.888Z',
    animalId: 'butterfly',
    animal: HARDCODED_ANIMALS.butterfly,
    status: 'discovered',
  },
  {
    id: 'bee3',
    latitude: 42.697708,
    longitude: 23.321867,
    pictureUrl:
      'https://cms.bbcearth.com/sites/default/files/factfiles/2024-07/Header%20image%20honeybee%20%28c%29%20adria_76_Bee%20Factfile_BBC%20Earth%20Factfile.jpg?imwidth=1920',
    rarity: 'RARE',
    obtainmentDate: '2025-03-15T10:45:48.888Z',
    animalId: 'bee',
    animal: HARDCODED_ANIMALS.bee,
    status: 'traded',
  },
  {
    id: 'butterfly2',
    latitude: 42.597708,
    longitude: 23.421867,
    pictureUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLKth1ccgTNEpKB6mhkW0N_Q9uBMS9Fvti-w&s',
    rarity: 'LEGENDARY',
    obtainmentDate: '2025-03-15T10:45:48.888Z',
    animalId: 'butterfly',
    animal: HARDCODED_ANIMALS.butterfly,
    status: 'traded',
  },
  {
    id: 'butterfly3',
    latitude: 42.597708,
    longitude: 23.421867,
    pictureUrl:
      'https://monarchbutterflies.ca/wp-content/uploads/2021/11/shutterstock_1244001271-1-scaled-e1639912934464.jpg',
    rarity: 'LEGENDARY',
    obtainmentDate: '2025-03-15T10:45:48.888Z',
    animalId: 'butterfly',
    animal: HARDCODED_ANIMALS.butterfly,
    status: 'traded',
  },
  {
    id: 'ant1',
    latitude: 42.597708,
    longitude: 23.421867,
    pictureUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHjJW4O8HBFUxYr6HVDMvy4KVG1KkVg3fMyw&s',
    rarity: 'COMMON',
    obtainmentDate: '2025-03-15T10:45:48.888Z',
    animalId: 'ant',
    animal: HARDCODED_ANIMALS.ant,
    status: 'discovered',
  },
  {
    id: 'ant2',
    latitude: 42.697708,
    longitude: 23.321867,
    pictureUrl:
      'https://americanpest.net/wp-content/uploads/2024/12/carpenter-ants-in-maryland.png',
    rarity: 'COMMON',
    obtainmentDate: '2025-03-15T10:45:48.888Z',
    animalId: 'ant',
    animal: HARDCODED_ANIMALS.ant,
    status: 'traded',
  },
  {
    id: 'dragonfly1',
    latitude: 42.697708,
    longitude: 23.321867,
    pictureUrl:
      'https://images.squarespace-cdn.com/content/v1/61c4da8eb1b30a201b9669f2/1717428004979-5XKMUIC8XWVHA1B1J4V8/Dragonfly2.jpg',
    rarity: 'EPIC',
    obtainmentDate: '2025-03-15T10:45:48.888Z',
    animalId: 'dragonfly',
    animal: HARDCODED_ANIMALS.dragonfly,
    status: 'discovered',
  },
  {
    id: 'dragonfly2',
    latitude: 42.697708,
    longitude: 23.321867,
    pictureUrl:
      'https://drivebyeexterminators.com/wp-content/uploads/2019/03/Fastest-Flying-Insect-is-the-Dragonfly.jpeg',
    rarity: 'EPIC',
    obtainmentDate: '2025-03-15T10:45:48.888Z',
    animalId: 'dragonfly',
    animal: HARDCODED_ANIMALS.dragonfly,
    status: 'traded',
  },
  {
    id: 'ladybug1',
    latitude: 42.697708,
    longitude: 23.321867,
    pictureUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/7-Spotted-Ladybug-Coccinella-septempunctata-sq1.jpg/800px-7-Spotted-Ladybug-Coccinella-septempunctata-sq1.jpg',
    rarity: 'COMMON',
    obtainmentDate: '2025-03-15T10:45:48.888Z',
    animalId: 'ladybug',
    animal: HARDCODED_ANIMALS.ladybug,
    status: 'discovered',
  },
  {
    id: 'ladybug2',
    latitude: 42.697708,
    longitude: 23.321867,
    pictureUrl:
      'https://upload.wikimedia.org/wikipedia/commons/3/3b/Seven_spotted_ladybug.jpg',
    rarity: 'COMMON',
    obtainmentDate: '2025-03-15T10:45:48.888Z',
    animalId: 'ladybug',
    animal: HARDCODED_ANIMALS.ladybug,
    status: 'traded',
  },
  {
    id: 'grasshopper1',
    latitude: 42.697708,
    longitude: 23.321867,
    pictureUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKmumsgkNz82_kLGL8qj4jiR7ug9-JDyoeTw&s',
    rarity: 'RARE',
    obtainmentDate: '2025-03-15T10:45:48.888Z',
    animalId: 'grasshopper',
    animal: HARDCODED_ANIMALS.grasshopper,
    status: 'discovered',
  },
  {
    id: 'grasshopper2',
    latitude: 42.697708,
    longitude: 23.321867,
    pictureUrl:
      'https://upload.wikimedia.org/wikipedia/commons/9/98/Grasshopper_01.jpg',
    rarity: 'RARE',
    obtainmentDate: '2025-03-15T10:45:48.888Z',
    animalId: 'grasshopper',
    animal: HARDCODED_ANIMALS.grasshopper,
    status: 'traded',
  },
]

export default function SelectCardModal({ onClose }) {
  const [selectedCard, setSelectedCard] = useState(undefined)
  const [cards, setCards] = useState(undefined)
  return (
    <div className={classes.overlay}>
      <div className={classes.modal}>
        <h1 className={classes.heading}>Select card for trade</h1>
        <SelectedCardsSection card={selectedCard} />
        {selectedCard && (
          <button className={classes.tradeBtn} onClick={onClose}>
            Trade
          </button>
        )}
        {(cards || []).map((card) => (
          <Card
            key={card.id}
            name={card.animal.name}
            image={card.pictureUrl}
            id={card.id}
            description={card.animal.description}
            onClick={() => setSelectedCard(card)}
          />
        ))}
      </div>
    </div>
  )
}
