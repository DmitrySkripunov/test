import styled from "@emotion/styled";
import { Box, Button, LinearProgress, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useStoreon } from "storeon/react";
import CharacterCard from "../components/CharacterCard/CharacterCard";
import Layout from "../components/Layout/Layout";
import { useDebounce } from "../hooks/useDebounce";
import { Events, State } from "../stores/characters";
import { CharacterEvents } from "../stores/events";
import css from "./Page.module.css";

export default function Home() {
  const { dispatch, results, request } = useStoreon<State, Events>(
    "results",
    "request"
  );
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce<string>(query, 250);

  useEffect(() => {
    dispatch(CharacterEvents.Search, debouncedQuery);
  }, [debouncedQuery]);

  const changeQuery = (event: React.ChangeEvent<HTMLInputElement>) =>
    setQuery(event.target.value);

  const people = results.results.map((character) => (
    <CharacterCard key={character.url} character={character} />
  ));

  return (
    <Layout>
      <h1 className={css.header}>Find your favorite StarWars character</h1>

      <TextField
        value={query}
        fullWidth
        label="Character"
        variant="standard"
        onChange={changeQuery}
      />

      {request.inProgress && (
        <LinearProgress
          color="warning"
          style={{ position: "fixed", top: 0, left: 0, right: 0 }}
        />
      )}

      {results.count === 0 && (
        <Box textAlign="center" m="50px auto">
          Empty result
        </Box>
      )}

      {results.count > 0 && <StyledResultBlock>{people}</StyledResultBlock>}

      <Box display="flex" width="100%" justifyContent="center" mt="15px">
        {results.previous && !request.inProgress && <Button>Previous</Button>}
        {results.next && !request.inProgress && <Button>Next</Button>}
      </Box>
    </Layout>
  );
}

const StyledResultBlock = styled(Box)`
  text-align: center;
  margin: 50px auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-column-gap: 15px;
  grid-row-gap: 15px;
`;
