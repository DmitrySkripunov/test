import styled from "@emotion/styled";
import { Box, Button, LinearProgress, TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
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
  let [searchParams, setSearchParams] = useSearchParams();
  const notInitialRender = useRef(false)

  const navigate = useNavigate();
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const debouncedQuery = useDebounce<string>(query, 250);

  useEffect(() => {
    if (notInitialRender.current) {
      searchParams.set('query', debouncedQuery);
      searchParams.delete('page');
      setSearchParams(searchParams);
    } else {
      notInitialRender.current = true
    }

  }, [debouncedQuery]);

  useEffect(() => {
    const page = searchParams.get('page');
    const query = searchParams.get('query');

    dispatch(CharacterEvents.Search, { query: page || query || '', isUrl: page !== null });
  }, [searchParams]);

  const changeQuery = (event: React.ChangeEvent<HTMLInputElement>) => setQuery(event.target.value);

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
          {request.inProgress ? 'Searching...' : 'Empty result'}
        </Box>
      )}

      {results.count > 0 && <StyledResultBlock>{people}</StyledResultBlock>}

      <Box display="flex" width="100%" justifyContent="center" mt="15px">
        {results.previous && (
          <Button
            disabled={request.inProgress}
            onClick={() => navigate( `/?page=${encodeURIComponent(results.previous || '')}&query=${query}`  )
           }
          >
            Previous
          </Button>
        )}
        {results.next && (
          <Button
            disabled={request.inProgress}
            onClick={() => {
              navigate(`/?page=${encodeURIComponent(results.next || '')}&query=${query}`);
            }}
          >
            Next
          </Button>
        )}
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
