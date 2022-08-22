import React from "react";
import { useParams } from "react-router-dom";

export default function Character() {
  const { id } = useParams();

  return <div>Hi, Character with id {id}!</div>;
}
