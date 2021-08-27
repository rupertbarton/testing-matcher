import React, { useEffect, useState } from "react";
import type * as types from "src/types";
import style from "./elements.module.css";

type stringOrNumber = string | number;

const ListItem = (props: {
  data: stringOrNumber[];
  onDelete?: () => void;
  onClick?: () => void;
  colors?: string[];
}) => {
  const data = props.data;

  const deleteButton = (onDelete?: () => void) => {
    if (props.onDelete !== undefined) {
      return (
        <div>
          <button className={style.destroy} onClick={props.onDelete}>
            X
          </button>
        </div>
      );
    }
  };

  const formattedData = data.map((datum, i) => {
    if (props.colors !== undefined) {
      const color = props.colors[i];
      return (
        <div className={style[color]} onClick={props.onClick}>
          {datum}
        </div>
      );
    }
    return <div>{datum}</div>;
  });

  return (
    <li className="listItem">
      {formattedData}
      {deleteButton(props.onDelete)}
    </li>
  );
};

export default ListItem;
