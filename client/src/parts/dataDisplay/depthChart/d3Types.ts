export type d3Node = {
  id: number;
  x: number;
  y: number;
};

export type d3Line = {
  node1: number;
  node2: number;
};

export type Graph = {
  nodes: d3Node[];
  lines: d3Line[];
};
