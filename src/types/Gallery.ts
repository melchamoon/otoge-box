import { Sheet } from './Sheet';

type GallerySection = {
  title?: string;
  description?: string;
  sheets?: Sheet[];
  sheetDescriptions?: string[];
};

type GalleryList = {
  title: string;
  id?: string;
  description?: string;
  sections: GallerySection[];
  isHidden?: boolean;
};

export type Gallery = GalleryList[];
