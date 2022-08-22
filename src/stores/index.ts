import { createStoreon } from "storeon";
import { characters } from "./characters";

const store = createStoreon([characters]);

export default store;
