import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";

// Funzione per aggiungere l'header di autorizzazione con il cookie ad ogni richiesta
const authLink = new ApolloLink((operation, forward) => {
  // Recupera il cookie desiderato dallo storage appropriato (ad esempio localStorage o document.cookie)
  const cookie = "il_tuo_cookie"; // Aggiungi il tuo cookie qui

  // Aggiunge l'header di autorizzazione alla richiesta
  operation.setContext({
    headers: {
      authorization: cookie ? `Bearer ${cookie}` : "",
    },
  });

  // Prosegui con la catena di Apollo Link
  return forward(operation);
});

export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: `${
        process.env.NODE_ENV === "production"
          ? `https://hypetribes.com`
          : "http://localhost:3000"
      }/api/graphql`,
    }),
  });
});
