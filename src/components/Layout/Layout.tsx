import React from "react";
import css from "./Layout.module.css";

export default function Layout({ children }: React.PropsWithChildren) {
  return <main className={css.root}>{children}</main>;
}
