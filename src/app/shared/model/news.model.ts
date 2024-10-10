export interface News {
  id: string;
  by: string| null;
  score: string | null;
  kids: number[] | null;
  title: string  | null;
  text: string  | null;
  type: string;
  url: string | null;
  time: number| null;
}
