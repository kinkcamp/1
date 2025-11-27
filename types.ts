export enum AppState {
  INTRO = 'INTRO',
  MEMORIES = 'MEMORIES',
  CODE = 'CODE',
  PROPOSAL = 'PROPOSAL',
  ACCEPTED = 'ACCEPTED'
}

export interface PhotoData {
  id: number;
  url: string;
  caption: string;
  date: string;
  position: [number, number, number];
  rotation: [number, number, number];
}
