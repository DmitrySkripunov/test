import { StoreonModule } from "storeon";
import { Character } from "../types/Character";
import { Request } from "../types/Request";
import { SearchResult } from "../types/SearchResult";
import { CharacterEvents } from "./events";

export interface State {
  characters: Map<string, Character>;
  results: SearchResult<Character>;
  request: Request;
}

export interface Events {
  [CharacterEvents.Search]: { query: string; isUrl?: boolean };
  [CharacterEvents.Get]: string;
  [CharacterEvents.Update]: Character;
  [CharacterEvents.UpdateResults]: SearchResult<Character>;
  [CharacterEvents.UpdateRequest]: Request;
}

const abortableSearchRequests: Set<AbortController> = new Set<
  AbortController
>();

export const characters: StoreonModule<State, Events> = (store) => {
  store.on("@init", () => ({
    characters: new Map(),
    results: {
      count: 0,
      next: null,
      previous: null,
      results: [],
    },
    request: { inProgress: false },
  }));

  store.on(CharacterEvents.Search, async ({}, { isUrl, query }) => {
    if (query.length === 0) return;

    store.dispatch(CharacterEvents.UpdateRequest, { inProgress: true });

    try {
      abortableSearchRequests.forEach((controller) => controller.abort());
      abortableSearchRequests.clear();

      const controller = new AbortController();
      abortableSearchRequests.add(controller);

      const result = await fetch(
        isUrl ? query : `https://swapi.dev/api/people/?search=${query}`,
        { signal: controller.signal }
      );
      const results = await result.json();

      store.dispatch(CharacterEvents.UpdateResults, results);
      store.dispatch(CharacterEvents.UpdateRequest, { inProgress: false });
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;

      store.dispatch(CharacterEvents.UpdateRequest, { inProgress: false });
    }
  });

  store.on(CharacterEvents.Get, async ({}, url) => {
    if (url.length === 0) return;

    store.dispatch(CharacterEvents.UpdateRequest, { inProgress: true });

    try {
      const result = await fetch(url);
      const results = await result.json();

      store.dispatch(CharacterEvents.Update, results);
    } finally {
      store.dispatch(CharacterEvents.UpdateRequest, { inProgress: false });
    }
  });

  store.on(CharacterEvents.Update, ({ characters }, character) => {
    characters.set(character.url, character);
    return { characters };
  });

  store.on(CharacterEvents.UpdateResults, ({ characters }, results) => {
    results.results.forEach((character) => {
      characters.set(character.url, character);
    });
    return { results, characters };
  });
  store.on(CharacterEvents.UpdateRequest, ({}, request) => ({ request }));
};
