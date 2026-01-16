export type Option = {
  id: string;
  name: string;
};

export type Accordian = {
  id: string | number;
  title: string;
  options: Option[];
};
