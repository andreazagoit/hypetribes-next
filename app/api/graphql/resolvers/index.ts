import CollectionModel from "../../models/CollectionModel";
import CommentModel from "../../models/CommentModel";
import UserModel from "../../models/UserModel";
import ItemModel from "../../models/itemModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {
  AddCollection,
  addCollectionFromUser,
  followCollection,
  getCollection,
  getCollectionTimeline,
} from "./collection";
import { addItem, getItem } from "./item";
import { getUser, getUserFromContext } from "./user";
import EntityModel from "../../models/EntityModel";

const moment = require("moment");

const resolvers = {
  Query: {
    // ITEMS
    // items: async () => getItems(),
    item: async (_, data) => getItem(data),
    // COLLECTIONS
    // collections: async () => getCollections(),
    collection: async (_, data, context) => getCollection({ data, context }),
    collectionTimeline: async (_, data, context) =>
      getCollectionTimeline({ data, context }),
    // COMMENTS
    // comments: async (_, data) => getComments(data),
    // USER
    user: async (parent, data, context) => getUser({ context }),
    entity: async (parent, data, context) => getEntity({ data }),
  },
  Mutation: {
    // ITEMS
    addItem: async (_, data, context) => addItem({ data, context }),
    // COMMENTS
    // addComment: async (_, data) => addComment(data),
    // COLLECTIONS
    addCollection: async (_, data, context) =>
      addCollectionFromUser({ data, context }),
    addEntity: async (_, data, context) => addEntity({ data, context }),
    followCollection: async (_, data, context) =>
      followCollection({ data, context }),
    // TEST
    addTestData: async (parent, data, context) => addTestData({ context }),
    // USER
    // registerWithCredentials: async (_, data) => registerWithCredentials(data),
    // loginWithCredentials: async (_, data) => loginWithCredentials(data),
    // loginWithGoogle: async (_, data) => loginWithGoogle(data),
  },
  Item: {
    /* comments: async (parent) => {
      await parent.populate({
        path: "comments",
        model: CommentModel,
      });
      return parent.comments;
    }, */
    /* collections: async (parent) => {
      await parent.populate({
        path: "collections",
        model: CollectionModel,
      });
      return parent.collections;
    }, */
    author: async (parent: any) => {
      try {
        const entity = await EntityModel.findOne({ key: parent.author });
        return entity;
      } catch (error) {
        console.error("Error fetching collection author", error);
        throw error;
      }
    },
  },
  Collection: {
    items: async (parent) => {
      try {
        const result = await CollectionModel.aggregate([
          // Match the document with the provided collection key
          {
            $match: { key: parent.key },
          },
          // Perform recursive lookup to fetch all items in this collection and its children
          {
            $graphLookup: {
              from: "collections",
              startWith: "$key",
              connectFromField: "collections",
              connectToField: "key",
              as: "childCollections",
              maxDepth: 10, // Adjust the depth as needed to avoid infinite loops
            },
          },
          // Unwind the child collections
          { $unwind: "$childCollections" },
          // Lookup to fetch items in the child collections
          {
            $lookup: {
              from: "items",
              localField: "childCollections.items",
              foreignField: "key",
              as: "items",
            },
          },
          // Unwind the items array
          { $unwind: "$items" },
          // Group to combine all items into a single array
          {
            $group: {
              _id: "$items.key", // Group by a unique identifier field
              item: { $first: "$items" }, // Keep the first occurrence of each item
            },
          },
          // Replace root to reshape the output
          {
            $replaceRoot: { newRoot: "$item" },
          },
          {
            $sort: { releaseDate: 1 }, // 1 for ascending order, -1 for descending order
          },
          {
            $addFields: {
              id: "$_id",
            },
          },
        ]);

        return result;
      } catch (error: any) {
        throw new Error(
          `Error fetching items for collection: ${error.message}`
        );
      }
    },
    collections: async (parent: any) => {
      try {
        const collections = await CollectionModel.find({
          key: { $in: parent.collections },
        });
        return collections;
      } catch (error) {
        console.error("Error fetching collections:", error);
        throw error;
      }
    },
    author: async (parent: any) => {
      try {
        const entity = await EntityModel.findOne({ key: parent.author });
        return entity;
      } catch (error) {
        console.error("Error fetching collection author", error);
        throw error;
      }
    },
    following: async (parent, args, context, info) => {
      try {
        const user = getUserFromContext(context);

        // GET USER MAIN_COLLECTION
        const mainCollection = await CollectionModel.findOne({
          key: `@${user.entity}`,
        });
        return mainCollection.collections.includes(parent.key);
      } catch (error) {
        return null;
      }
    },
  },
  User: {
    entity: async (parent: any) => {
      try {
        const entity = await EntityModel.findOne({ key: parent.entity });
        return entity;
      } catch (error) {
        console.error("Error fetching collection author", error);
        throw error;
      }
    },
  },
};

export default resolvers;

const getItems = async () => {
  try {
    const items = await ItemModel.find();
    return items;
  } catch (error: any) {
    throw new Error("Error fetching items: " + error.message);
  }
};

interface GetCommentsProps {
  id: string;
}

const getComments = async (data: GetCommentsProps) => {
  const { id } = data;
  try {
    const item = await ItemModel.findById(id);

    if (!item) {
      console.error("Item not found");
      return null;
    }

    const populatedItem = await item.populate({
      path: "comments",
      model: CommentModel,
    });

    return populatedItem.comments || [];
  } catch (error: any) {
    throw new Error(`Error getting item: ${error.message}`);
  }
};

interface AddCommentProps {
  id: string;
  text: string;
}
const addComment = async (data: AddCommentProps) => {
  const { id, text } = data;

  try {
    const item = await ItemModel.findById(id);

    if (!item) {
      console.error("Item not found");
      return null;
    }

    const newComment = new CommentModel({ text });
    await newComment.save();

    item.comments.push(newComment._id);
    await item.save();

    return newComment;
  } catch (error: any) {
    throw new Error(`Error creating item: ${error.message}`);
  }
};

const addTestData = async ({ context }) => {
  const user = getUserFromContext(context);

  // Reset database
  /* await CollectionModel.deleteMany({});
  await ItemModel.deleteMany({});
  await CommentModel.deleteMany({}); */

  const collectionsToAdd = [
    { key: "fashion", name: "Fashion" },
    { key: "gucci", name: "Gucci", collections: ["fashion"] },
    { key: "dior", name: "Dior", collections: ["fashion"] },
    { key: "movies", name: "Movies" },
    { key: "movies_horror", name: "Horror Movies", collections: ["movies"] },
    { key: "movies_action", name: "Action Movies", collections: ["movies"] },
    {
      key: "movies_romantic",
      name: "Romantic Movies",
      collections: ["movies"],
    },
    {
      key: "movies_adventure",
      name: "Adventure Movies",
      collections: ["movies"],
    },
    {
      key: "movies_commedy",
      name: "Commedy Movies",
      collections: ["movies"],
    },
    { key: "books", name: "Books" },
  ];

  for (const collection of collectionsToAdd) {
    await addCollectionFromUser({ data: collection, context });
  }

  const itemsToAdd = [
    {
      key: "godzilla-e-kong-il-nuovo-impero",
      name: "Godzilla e Kong - Il nuovo impero",
      description:
        "Due antichi titani, Godzilla e Kong, si scontrano in un'epica battaglia mentre gli umani svelano le loro origini intrecciate e il loro legame con i misteri dell'Isola del Teschio.",
      images: ["https://pad.mymovies.it/filmclub/2022/11/017/locandina.jpg"],
      releaseDate: moment("2024-03-28T09:00:00").toDate(),
      collections: ["movies_action", "movies_adventure"],
    },
    {
      key: "la-passione-di-dodin-bouffant",
      name: "La passione di Dodin Bouffant",
      description:
        "Le vite e le lotte di Eugenie, stimata cuoca, e Dodin, il buongustaio con cui ha lavorato negli ultimi vent'anni.",
      images: [
        "https://movieplayer.net-cdn.it/t/images/2024/02/20/passion-dodin-bouffant_jpg_400x0_crop_q85.jpg",
      ],
      releaseDate: moment("2024-03-28T09:30:00").toDate(),
      collections: ["movies_romantic"],
    },
    {
      key: "gli-uomini-e-altri-inconvenienti",
      name: "Gli uomini e altri inconvenienti",
      images: [
        "https://m.media-amazon.com/images/M/MV5BMzc2M2M1YzYtMmFhMC00Mzc3LWJjOGEtMTBhYjIzMjhhMGU2XkEyXkFqcGdeQXVyOTU5MDg2OQ@@._V1_.jpg",
      ],
      releaseDate: moment("2024-04-03T09:00:00").toDate(),
      collections: ["movies_commedy"],
    },
    {
      key: "ghostbusters-minaccia-glaciale",
      name: "Ghostbusters - Minaccia glaciale",
      description:
        "Quando la scoperta di un antico artefatto scatena una forza malvagia, gli Acchiappafantasmi vecchi e nuovi devono unire le forze per proteggere la loro casa e salvare il mondo da una seconda era glaciale.",
      images: [
        "https://www.ingenerecinema.com/wp-content/uploads/2023/12/412309022_903470824611981_6033100022399982508_n.jpg",
      ],
      releaseDate: moment("2024-04-11T09:00:00").toDate(),
      collections: ["movies_adventure"],
    },
    {
      key: "furiosa-a-mad-max-saga",
      name: "Furiosa: A Mad Max Saga",
      description: `La storia delle origini della guerriera rinnegata, Furiosa, prima che si unisse a Mad Max in "Fury Road".`,
      images: [
        "https://www.metropoliscinemas.it/uploads/eventi/thumb_zoom/Furiosa__a_mad_max_saga.webp?1710503212",
      ],
      releaseDate: moment("2024-05-11T09:00:00").toDate(),
      collections: ["movies_adventure"],
    },
    {
      key: "book-1",
      name: "A light in the flame. Una luce nella fiamma. Flesh and Fire. Vol. 2",
      description: `«Tu sei l’erede delle terre e dei mari, dei cieli e dei regni. Una regina al posto di un re. Tu sei la primordiale della vita.»


      Ora che la verità sul suo piano è venuta a galla, mandando in frantumi la fragile fiducia che si era instaurata tra lei e Nyktos, a Seraphena non resta che aggrapparsi al proprio senso del dovere. Per questo farà tutto il possibile per fermare Kolis, il falso Re degli Dei, e porre fine alla sua tirannia su Iliseum e alla minaccia che rappresenta per i mortali. Anche se questo significa seguire il piano di Nyktos. L’ultima cosa di cui entrambi hanno bisogno mentre lavorano insieme è l’innegabile, bruciante passione che continua ad accendersi tra loro. In più, Sera non può permettersi di innamorarsi del tormentato Primordiale, men che meno adesso che la sua vita non è più legata a un destino che non ha mai voluto. Ma come resistere ai ricordi del piacere che hanno condiviso e che ancora li consuma? E al desiderio irrazionale di diventare per Nyktos una Consorte di fatto e non solo di nome? Poi, mentre il pericolo che li circonda cresce e gli attacchi alle Terre d’Ombra si intensificano, a un tratto si presenta un rischio del tutto nuovo: il potere primordiale della Vita sta crescendo dentro di lei e preme per manifestarsi. E Seraphena sa che senza l’amore di Nyktos – un’emozione che lui non è in grado di provare – non sopravvivrà all’Ascensione. Sempre che riesca ad arrivarci, naturalmente, perché il tempo sta per scadere… per lei e per i regni.`,
      images: [
        "https://www.lafeltrinelli.it/images/9791259853233_0_536_0_75.jpg",
      ],
      releaseDate: moment("2024-03-26T09:00:00").toDate(),
      collections: ["books"],
    },
    {
      key: "book-2",
      name: "Liberi come il vento",
      description: `Quando il vento del nord porta con sé una piuma d’aquila grigia, un grande cambiamento sta per arrivare: questa è la leggenda che gli antenati di Hurst Paytah tramandano da generazioni. Lui non ci ha mai creduto, perché il suo destino è stato stabilito sin da piccolo. Da orfano indesiderato perché solo per metà nativo, è riuscito a conquistare la fiducia della tribù ed è stato scelto per diventare capo. Hurst, però, è solo un ragazzo, e si sente inadatto a comandare perché è tutto fuorché calmo e razionale. Per fortuna c’è Nive che, con i suoi timidi sorrisi e i suoi guanti rossi, gli ha mostrato che la gentilezza può sciogliere anche il ghiaccio più duro e che si può essere completi anche quando ci si sente a metà. Eppure, ora che lei è lontana per studiare al college, Hurst si sente sempre più insicuro e il vecchio dubbio di non essere all’altezza lo tormenta. Come se non bastasse, sul suo comodino compare all’improvviso una piuma d’aquila grigia. Mentre ne osserva i riflessi, si sente invadere dalla paura: forse il destino suo e di Nive non è di restare legati per tutta la vita; forse basterà una folata di vento per distruggerli. Ora Hurst deve scoprire che solo chi affronta la vertigine ha la forza per spiccare il volo.`,
      images: [
        "https://www.lafeltrinelli.it/images/9788811010999_0_536_0_75.jpg",
      ],
      releaseDate: moment("2024-03-26T09:00:00").toDate(),
      collections: ["books"],
    },
    {
      key: "book-3",
      name: "Il mio sbaglio più grande. Corrupt. Limited edition. Devil’s night series",
      description: `Si chiama Michael Crist. È il fratello maggiore del mio ragazzo ed è come quei film dell'orrore che guardi coprendoti gli occhi. È bellissimo, forte, e assolutamente terrificante. Non mi vede neppure. Ma io l'ho notato. L'ho visto, l'ho sentito. Quello che ha fatto, i misfatti che ha nascosto. E non so quanto ancora riuscirò a tenere segrete le cose che gli ho visto fare. Si chiama Erika Fane, ma tutti la chiamano Rika. È la ragazza di mio fratello ed è sempre in giro per casa nostra, sempre a cena con noi. Riesco a percepire la sua paura, e anche se non possiedo il suo corpo, so di avere la sua mente. È l'unica cosa che voglio. Tra poco andrà da sola al college. Nella mia città. Indifesa. L'occasione è incredibilmente allettante. Perché tre anni fa per colpa sua alcuni miei amici sono finiti in prigione, e ora sono usciti. Abbiamo aspettato. Siamo stati pazienti. E ora tutti i suoi incubi stanno per avverarsi.`,
      images: [
        "https://www.lafeltrinelli.it/images/9788822786654_0_536_0_75.jpg",
      ],
      releaseDate: moment("2024-03-26T09:00:00").toDate(),
      collections: ["books"],
    },
    {
      key: "book-4",
      name: "Incantevole tentazione. Badlands",
      description: `È un lunedì grigio e piovoso quello in cui Juliet, diciassettenne ribelle e capricciosa, si trasferisce a casa del nuovo compagno della madre, dove vive anche Alexander, il figlio di lui. Affascinante ed enigmatico, il nuovo coinquilino è un mistero dagli occhi di tenebra e dal passato complicato, ed è l'esatto opposto di Juliet: lei fatica a prendere la sufficienza, lui ha ottimi voti; lei ama il gossip e le feste, lui preferisce starsene rintanato in camera sua con un libro. Tra i due è subito guerra aperta, ma ben presto i battibecchi si trasformano in baci infuocati scambiati di nascosto, all'insaputa dei genitori. Tuttavia, Alexander è uno scrigno pieno di segreti di cui nessuno possiede la chiave, nemmeno Juliet. Col passare del tempo, però, l'attrazione e la passione alla ragazza non bastano più e desidera l'accesso al suo cuore. Alexander sarà disposto a concederglielo oppure rischierà di perderla per sempre? Alexander è un mistero dagli occhi di tenebra. Juliet desidera scoprire ogni suo segreto.`,
      images: [
        "https://www.lafeltrinelli.it/images/9788822784179_0_536_0_75.jpg",
      ],
      releaseDate: moment("2024-03-26T09:00:00").toDate(),
      collections: ["books"],
    },

    { key: "gucci-item-1", name: "Gucci 1", collections: ["gucci"] },
    { key: "gucci-item-2", name: "Gucci 2", collections: ["gucci"] },
  ];

  for (const item of itemsToAdd) {
    await addItem({ data: item, context });
  }

  return "done";
};

interface RegisterWithCredentialsProps {
  name: string;
  email: string;
  password: string;
}
const registerWithCredentials = async (data: RegisterWithCredentialsProps) => {
  const { name, email, password } = data;

  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    throw new Error(`The user exist`);
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user with hashed password
  const newUser = new UserModel({
    name,
    email,
    credentials: { password: hashedPassword },
  });
  await newUser.save();

  // Generate JWT
  const token = jwt.sign({ userId: newUser._id }, "your_secret_key", {
    expiresIn: "1h",
  });

  return {
    id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    token,
  };
};

interface LoginWithCredentialsProps {
  email: string;
  password: string;
}
const loginWithCredentials = async (data: LoginWithCredentialsProps) => {
  const { email, password } = data;

  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new Error(`User not found`);
  }

  // Check if the password matches
  const isPasswordValid = await bcrypt.compare(
    password,
    user.credentials.password
  );

  if (!isPasswordValid) {
    throw new Error(`Invalid password`);
  }

  // Generate JWT
  const token = jwt.sign({ userId: user.id }, "your_secret_key", {
    expiresIn: "1h",
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    token: token,
  };
};

interface AddEntityProps {
  data: {
    key: string;
    name: string;
    bio: string;
    picture: string;
  };
  context?: any;
}

export const addEntity = async ({ data }: AddEntityProps) => {
  const { key, name, bio, picture } = data;

  try {
    // Check if an entity with that key already exists
    const existingEntity = await EntityModel.findOne({ key });
    if (existingEntity) {
      throw new Error(`Entity with key '${key}' already exists.`);
    }

    // Create a new entity
    const newEntity = new EntityModel({
      key,
      name,
      bio,
      picture,
    });

    const userCollection = await AddCollection({
      data: { key: `@${key}`, name },
      entity: newEntity.key,
    });

    newEntity.mainCollection = userCollection.key;
    await userCollection.save();
    await newEntity.save();

    return newEntity;
  } catch (error: any) {
    throw new Error(`Error creating entity: ${error.message}`);
  }
};

interface GetEntityProps {
  data: {
    key: string;
  };
}

export const getEntity = async ({ data }: GetEntityProps) => {
  const { key } = data;

  try {
    const entity = EntityModel.findOne({ key });
    return entity;
  } catch (error: any) {
    throw new Error(`Error getting entity: ${error.message}`);
  }
};
