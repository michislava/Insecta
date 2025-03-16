import cors from "cors";
import express, { Request, response, Response } from "express";
import multer from "multer";
import { uploadImage } from "./image-logic/uploadImage";
import dotenv from "dotenv";
import {
  checkDiscoverer,
  getUserById,
  loginUser,
} from "./db-services/userService";
import { createCard, getAllCardsForUser } from "./db-services/cardService";
import fs from "fs/promises";
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
import bodyParser from "body-parser";
dotenv.config();
const app = express();
const upload = multer({ dest: "uploads/" });

const rarityMap: { [key: number]: Rarity } = {
  0: "COMMON",
  1: "UNCOMMON",
  2: "RARE",
  3: "EPIC",
  4: "LEGENDARY",
  5: "MYTHIC",
};
const HARDCODED_USERS = [
  { userId: "123123123", name: "Alice" },
  { userId: "241", name: "Bob" },
  { userId: "12415", name: "Carl" },
  { userId: "9871287", name: "Dave" },
];
interface AnimalDTO {
  result: {
    classification: {
      suggestions: [
        {
          name: string;
        }
      ];
    };
  };
}

dotenv.config();

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

function getCardPartial(
  animalId: string,
  latitude: Decimal,
  longitude: Decimal,
  imageUrl: string,
  userId: string
): CardPartial {
  const card: CardPartial = {
    latitude: latitude,
    longitude: longitude,
    pictureUrl: imageUrl,
    rarity: rarityMap[getRarity()],
    animalId: animalId,
    ownerId: userId,
    discovererId: userId,
  };

  return card;
}

async function tryCatchRoute(fn: any, req: any, res: any, next: any) {
  try {
    await fn(req, res, next);
  } catch (err) {
    return res.status(500).json({ message: "internal error" });
  }
}

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
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

// @TODO use db
app.get(
  "/nearby-users/:lat/:lon",
  tryCatchRoute.bind(null, async (req: any, res: any): Promise<any> => {
    return res.json({ users: HARDCODED_USERS });
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

app.post(
  "/upload",
  upload.single("image"),
  async (req: Request, res: Response): Promise<any> => {
    const userId = req.body.userId;

    if (!req.file?.path) {
      return res.status(400).json({ success: false, error: "Invalid upload" });
    }

    const fileBuffer = await fs.readFile(req.file.path).catch((error) => {
      return res
        .status(500)
        .json({ message: "Error reading file", error: error });
    });

    const base64Image =
      "data:image/jpeg;base64," + fileBuffer.toString("base64");

    const data = JSON.stringify({
      images: [base64Image],
    });

    const url = `${config.INSECT_API_HOST!}/api/v1/identification?details=url,description,image`;

    let body = {
      method: "post",
      maxBodyLength: Infinity,
      url: url,
      headers: {
        "Api-Key": config.INSECT_API_KEY,
        "Content-Type": "application/json",
      },
      data: data,
    };

    const response = await axios.request(body);

    const latinName = response.data.result.classification.suggestions[0]?.name;
    console.log(latinName);

    // if (await checkDiscoverer(userId, latinName)) {
    //     return res.json({
    //         'message': 'Card already discovered'
    //     });
    // }

    try {
      const imageUrl = await uploadImage(req.file.path, userId);
      console.log({ imageUrl });
      return res.json({ success: true, imageUrl });
    } catch (error) {
      return res.json({ success: false, error: "Internal server error" });
    }
  }
);

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

  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
