import React, { useEffect, useState } from "react";
import type * as types from "src/types";

type stringOrNumber = string | number;

const ListItem = (prop: { data: stringOrNumber[]; onDelete?: () => void }) => {
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

  const formattedData = data.map((datum) => <div>{datum}</div>);

  return (
    <li className="listItem">
      {formattedData}
      {deleteButton(prop.onDelete)}
    </li>
  );
};

export default ListItem;
