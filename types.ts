export type Pet = {
  id: number;
  name: string;
};

export type PetOption = {
  value: number;
  title: string;
};

export type PetDescription = {
  name: string;
  id: number;
  breeds: Breed;
  size: string;
  age: string;
  colors: Color;
  status: string;
};

type Breed = {
  primary: string | null;
  secondary: string | null;
  mixed: boolean;
  unknown: boolean;
};

type Color = {
  primary: string | null;
  secondary: string | null;
  tertiary: string | null;
};

export type PetResponse = { animals: PetDescription[] };

export type PetDetailResponse = { animal: PetDescription };

export type JWTType = { exp: number; aud: string; jti: string };
