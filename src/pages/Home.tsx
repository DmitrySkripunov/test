import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useStoreon } from "storeon/react";
import Layout from "../components/Layout/Layout";
import { useDebounce } from "../hooks/useDebounce";
import { CharacterEvents } from "../stores/events";
import css from "./Page.module.css";

export default function Home() {
  const { dispatch } = useStoreon();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce<string>(query, 250);

  useEffect(() => {
    dispatch(CharacterEvents.Search, debouncedQuery);
  }, [debouncedQuery]);

  const changeQuery = (event: React.ChangeEvent<HTMLInputElement>) =>
    setQuery(event.target.value);

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
    </Layout>
  );
}
