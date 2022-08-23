import React from "react";
import { Box, Card } from "@mui/material";
import { Character } from "../../types/Character";
import { useNavigate } from "react-router-dom";

export default function CharacterCard({ character }: { character: Character }) {
  const navigate = useNavigate();
  return (
    <Card
      style={{ cursor: "pointer" }}
      onClick={() =>
        navigate(`/character/${encodeURIComponent(character.url)}`)
      }
    >
      <Box p="20px" textAlign="left">
        <Box mb="10px">
          <strong>{character.name}</strong>
        </Box>
        <Box mb="10px">
          Films count: <strong>{character.films.length}</strong>
        </Box>
        <Box>
          Gender: <strong>{character.gender}</strong>
        </Box>
      </Box>
    </Card>
  );
}
