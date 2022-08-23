import { Box, LinearProgress } from "@mui/material";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useStoreon } from "storeon/react";
import Layout from "../components/Layout/Layout";
import { Events, State } from "../stores/characters";
import { CharacterEvents } from "../stores/events";
import css from "./Page.module.css";

export default function Character() {
  const { id } = useParams();
  const { dispatch, characters, request } = useStoreon<State, Events>(
    "characters",
    "request"
  );

  let character = characters.get(String(id));

  useEffect(() => {
    if (!character) {
      dispatch(CharacterEvents.Get, id);
    }
  }, []);

  return (
    <Layout>
      <h1 className={css.header}>
        Your favorite StarWars character is - {character ? character.name : ""}
      </h1>

      {request.inProgress && (
        <LinearProgress
          color="warning"
          style={{ position: "fixed", top: 0, left: 0, right: 0 }}
        />
      )}

      <Box p="20px" textAlign="left">
        <Box mb="10px">
          Films count:{" "}
          <strong>{character ? character.films.length : ""}</strong>
        </Box>
        <Box mb="10px">
          Gender: <strong>{character ? character.gender : ""}</strong>
        </Box>
        <Box mb="10px">
          Birth year: <strong>{character ? character.birth_year : ""}</strong>
        </Box>
        <Box mb="10px">
          Eye color: <strong>{character ? character.eye_color : ""}</strong>
        </Box>
        <Box mb="10px">
          Skin color: <strong>{character ? character.skin_color : ""}</strong>
        </Box>
        <Box mb="10px">
          Hair color: <strong>{character ? character.hair_color : ""}</strong>
        </Box>
      </Box>
    </Layout>
  );
}
