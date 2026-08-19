declare module "*.png" {
  const image: {
    src: string;
    width: number;
    height: number;
    blurDataURL?: string;
  };
  export default image;
}

declare module "*.jpg" {
  const image: {
    src: string;
    width: number;
    height: number;
    blurDataURL?: string;
  };
  export default image;
}
