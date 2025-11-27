import { PhotoData } from './types';

export const LOVE_CODE = `
class Forever {
  constructor(you) {
    this.you = you;
    this.me = "Programmer";
    this.love = Infinity;
  }

  async init() {
    while(alive) {
      await this.cherish(this.you);
      this.memories.push(new Moment());
    }
  }

  get happiness() {
    return this.you.smile ? 100 : 0;
  }
}

const ourFuture = new Forever(you);
await ourFuture.init();
`;

export const PHOTOS: PhotoData[] = [
  {
    id: 1,
    url: "https://picsum.photos/id/10/400/500",
    caption: "Where it all began",
    date: "Feb 14, 2023",
    position: [-1.5, 0, -5],
    rotation: [0, 0.2, 0]
  },
  {
    id: 2,
    url: "https://picsum.photos/id/15/400/500",
    caption: "Our first trip",
    date: "July 20, 2023",
    position: [1.5, 0.5, -10],
    rotation: [0, -0.2, 0.1]
  },
  {
    id: 3,
    url: "https://picsum.photos/id/20/400/500",
    caption: "Moving in together",
    date: "Jan 01, 2024",
    position: [-1.2, -0.5, -15],
    rotation: [0, 0.3, -0.1]
  },
  {
    id: 4,
    url: "https://picsum.photos/id/25/400/500",
    caption: "The happiest day... so far",
    date: "Dec 25, 2025",
    position: [0, 0, -20],
    rotation: [0, 0, 0]
  }
];
