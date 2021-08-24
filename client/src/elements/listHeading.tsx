import React, { useEffect, useState } from "react";
import type * as types from "src/types";

type stringOrNumber = string | number;

const ListHeading = (props: { data: stringOrNumber[] }) => {
  const data = props.data;
  let formattedData = data.map((datum) => <div>{datum}</div>);
  return <li className="listHeading">{formattedData}</li>;
};

export default ListHeading;
