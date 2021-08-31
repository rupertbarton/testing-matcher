import React, { useEffect, useState } from "react";
import type * as types from "src/types";
import style from "./elements.module.css";

type stringOrNumber = string | number;

const ListHeading = (props: { data: stringOrNumber[]; class?: string }) => {
  const data = props.data;
  let formattedData = data.map((datum) => <div>{datum}</div>);
  if (props.class) {
    return (
      <li className={"listHeading" + " " + style[props.class]}>
        {formattedData}
      </li>
    );
  }
  return <li className={"listHeading"}>{formattedData}</li>;
};

export default ListHeading;
