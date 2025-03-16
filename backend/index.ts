import cors from "cors";
import express, { Request, response, Response } from "express";
import multer from "multer";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import {
  checkDiscoverer,
  createUser,
  getUserById,
  loginUser,
} from "./db-services/userService";
import { createCard, getAllCardsForUser } from "./db-services/cardService";
import {
  createAnimal,
  getAnimalByLatinName,
} from "./db-services/animalService";

import { Rarity } from "@prisma/client";
import { CardPartial } from "./db-services/cardService";
import { Decimal } from "@prisma/client/runtime/library";
import axios from "axios";
import {
  createTrade,
  finalizeTrade,
  getTradeById,
} from "./db-services/tradeService";
import { session, sess } from "./authentication";
import { uploadImage } from "./image-logic/uploadImage";

dotenv.config();

const HARDCODED_API_DATA = {
  classification: {
    suggestions: [
      {
        id: "c8c9f42bd6338f61",
        name: "Formica rufa",
        probability: 0.4799,
        details: {
          url: "https://en.wikipedia.org/wiki/Formica_rufa",
          description: {
            value:
              "Formica rufa, also known as the  red wood ant, southern wood ant, or horse ant, is a boreal member of the Formica rufa group of ants, and is the type species for that group, being described already by Linneaus. It is native to Eurasia, with a recorded distribution stretching from the middle of Scandinavia to the northern Iberia and Anatolia, and from Great Britain to Lake Baikal, with unconfirmed reportings of it also to the Russian Far East. There are claims that it can be found in North America, but this is not confirmed in specialised literature, and no recent publication where North American wood ants are listed mentions it as present, while records from North America are all listed as dubious or unconfirmed in a record compilation. Workers head and thorax are colored red and the abdomen brownish-black, usually with a dorsal dark patches on the head and promensonotum, although some individuals may be more uniform reddish and even have some red on the part of the gastern facing the body. In order to separate them from closely related species, specimens needs to be inspected under magnification, where difference in hairyness are among the telling characteristics, with Formica rufa being more hairy than per example Formica polyctena but less hairy than Formica lugubris. Workers are polymorphic, measuring 4.5–9 mm in length. They have large mandibles, and like many other ant species, they are able to spray formic acid from their abdomens as a defence. Formic acid was first extracted in 1671 by the English naturalist John Ray by distilling a large number of crushed ants of this species. These ants primarily eat honeydew from aphids. Some groups form large networks of connected nests with multiple queen colonies, while others have single-queen colonies.",
            citation: "https://en.wikipedia.org/wiki/Formica_rufa",
            license_name: "CC BY-SA 3.0",
            license_url: "https://creativecommons.org/licenses/by-sa/3.0/",
          },
          image: {
            value:
              "https://insect-id.ams3.cdn.digitaloceanspaces.com/knowledge_base/wikidata/bd8/bd885c1ee4d96446a925287fa0fc401b031bf1b1.jpg",
            citation: "//commons.wikimedia.org/wiki/User:Makro_Freak",
            license_name: "CC BY-SA 2.5",
            license_url: "https://creativecommons.org/licenses/by-sa/2.5/",
          },
          language: "en",
          entity_id: "c8c9f42bd6338f61",
        },
      },
    ],
  },
  is_insect: {
    probability: 0.994601,
    threshold: 0.5,
    binary: true,
  },
};

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(bodyParser.json({ limit: "10mb" })); // Increase limit if needed
const upload = multer({ dest: "uploads/" });

const rarityMap: { [key: number]: Rarity } = {
  0: "COMMON",
  1: "UNCOMMON",
  2: "RARE",
  3: "EPIC",
  4: "LEGENDARY",
  5: "MYTHIC",
};

const config = {
  INSECT_API_HOST: process.env.INSECT_API_HOST,
  INSECT_API_KEY: process.env.INSECT_API_KEY,
};

function getRarity(): number {
  const random = Math.random();
  let rarity = 0;

  if (random < 0.75) {
    rarity = 1;
  } else if (random < 0.85) {
    rarity = 2;
  } else if (random < 0.92) {
    rarity = 3;
  } else if (random < 0.97) {
    rarity = 4;
  } else {
    rarity = 5;
  }

  return rarity;
}

async function tryCatchRoute(fn: any, req: any, res: any, next: any) {
  try {
    await fn(req, res, next);
  } catch (err) {
    return res.status(500).json({ message: "internal error" });
  }
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(session(sess));

app.get(
  "/cards",
  tryCatchRoute.bind(null, async (req: any, res: any): Promise<any> => {
    const cards = await getAllCardsForUser(req.session.userId).catch(
      console.error
    );
    return res.json({ cards });
  })
);

// @NOTE: ditched idea for now
// @TODO use db
// app.get('/battle-deck/:userId', tryCatchRoute.bind(null, async (req: any, res: any): Promise<any> => {
//     const cards = []
//     while(cards.length<5){
//         cards.push(HARDCODED_CARDS[Math.floor((Math.random()%1)*HARDCODED_CARDS.length)])
//     }
//     return res.json({ cards })
// }))

app.get(
  "/trade/:tradeId",
  tryCatchRoute.bind(null, async (req: any, res: any): Promise<any> => {
    const { tradeId } = req.params;
    const trade = await getTradeById(parseInt(tradeId));
    return res.json({ trade });
  })
);

app.post(
  "/create-trade/:userId/:cardId",
  tryCatchRoute.bind(null, async (req: any, res: any): Promise<any> => {
    const { userId, cardId } = req.params;
    const trade = await createTrade(userId, cardId);
    return res.json({ trade });
  })
);

app.post(
  "/finalize-trade/:tradeId/:userId/:cardId",
  tryCatchRoute.bind(null, async (req: any, res: any): Promise<any> => {
    const { userId, cardId, tradeId } = req.params;
    // @TODO validation if trade, user and card exist
    const trade = await finalizeTrade(parseInt(tradeId), userId, cardId);
    return res.json({ trade });
  })
);

app.post("/upload", async (req: any, res: any): Promise<any> => {
  const { image } = req.body; 
  const userId = req.session.userId
  const base64Image = image;
  if (!userId) return res.status(400).json({ message: "userId is required" });
  if (!image) return res.status(400).json({ message: "image is required" });

  const insectApi = `${config.INSECT_API_HOST!}/api/v1/identification?details=url,description,image`;
  let body = {
    method: "post",
    maxBodyLength: Infinity,
    url: insectApi,
    headers: {
      "Api-Key": config.INSECT_API_KEY,
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      images: [base64Image],
    }),
  };
  const response = await axios
    .request(body)
    .catch((r) => console.error(r.message));
  // const apiData = HARDCODED_API_DATA
  const apiData = response?.data?.result;
  if (!apiData?.classification?.suggestions?.length)
    return res.status(404).json({ message: "not recognized" });
  const {
    name: latinName,
    details: {
      url,
      description: { value: description },
    },
  } = apiData.classification.suggestions[0];

  let foundAnimal = await getAnimalByLatinName(latinName);
  if (!foundAnimal) foundAnimal = await createAnimal(latinName, description);

  if (!foundAnimal)
    return res
      .status(500)
      .json({ message: "Internal error finding and creating an animal" });

  const imageUrl = await uploadImage(image, userId).catch(console.error);
  if (!imageUrl)
    return res.status(500).json({ message: "error saving the image" });

  // @TODO we can disallow the user from getting two cards from same type
  const card = await createCard({
    latitude: 42 as any,
    longitude: 42 as any,
    pictureUrl: imageUrl,
    rarity: "RARE",
    animalId: foundAnimal.id,
    ownerId: userId,
    discovererId: userId,
  });
  return res.json({ card });
});

app.post("/register", async (req: any, res: Response): Promise<any> => {
  const { username, email, passHash } = req.body;

  const userId: String | undefined = await createUser(
    email,
    username,
    passHash
  );

  if (!userId) return res.status(500).json({ message: "User not created " });

  req.session.userId = userId;

  res.json({ userId });
});

app.post("/login", async (req: any, res: Response): Promise<any> => {
  const { username, passHash } = req.body;

  const userId: String | undefined = await loginUser(username, passHash);

  if (!userId) return res.status(500).json({ message: "User not found" });

  req.session.userId = userId;

  res.json({ userId });
});

app.get("/profile", async (req: any, res: Response): Promise<any> => {
  const user = getUserById(req.session.userId);

  if (!user) return res.status(403).json({ message: "User not found" });

  res.json({ user });
});

app.get("/logout", async (req: any, res: Response): Promise<any> => {
  req.session.destroy((err: any) => {
    if (!err) return res.status(500).json({ message: "Error logging out" });
  });

  res.status(200).json({ message: "Successful logout" });
});

app.get("/check-session", async (req: any, res: Response): Promise<any> => {
    if (!req.session.userId)
        return res.status(404).json({ message: "Session doesn't exist "});

  res.status(200).json({ message: "Session exists" });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
