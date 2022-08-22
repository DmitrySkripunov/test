import { StoreonModule } from "storeon";
import { CharacterEvents } from "./events";

export interface State {
  characters: Object;
  results: Object[];
}

export interface Events {
  [CharacterEvents.Search]: string;
  [CharacterEvents.Get]: string;
  [CharacterEvents.Update]: string;
}

export const characters: StoreonModule<State, Events> = (store) => {
  store.on("@init", () => ({ characters: {} }));
  store.on(CharacterEvents.Search, async ({}, query) => {
    if (query.length === 0) return;

    const result = await fetch(`https://swapi.dev/api/people/?search=${query}`);
    console.log(result);
  });

  store.on(CharacterEvents.Get, ({}, id) => {
    console.log("Character id: ", id);
  });

  store.on(CharacterEvents.Update, ({}, id) => {
    console.log("Character id: ", id);
  });
};
