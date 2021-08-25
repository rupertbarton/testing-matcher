import React, { useEffect, useState } from "react";
import type * as types from "src/types";
import style from "./elements.module.css";

type stringOrNumber = string | number;

const ListItem = (prop: {
  data: stringOrNumber[];
  onDelete?: () => void;
  colors?: string[];
}) => {
  const data = prop.data;

  const deleteButton = (onDelete?: () => void) => {
    if (prop.onDelete !== undefined) {
      return (
        <div>
          <button className="destroy" onClick={prop.onDelete}>
            X
          </button>
        </div>
      );
    }
  };

  const formattedData = data.map((datum, i) => {
    if (prop.colors !== undefined) {
      const color = prop.colors[i];
      return <div className={style[color]}>{datum}</div>;
    }
    return <div>{datum}</div>;
  });

  return (
    <li className="listItem">
      {formattedData}
      {deleteButton(prop.onDelete)}
    </li>
  );
};

export default ListItem;
