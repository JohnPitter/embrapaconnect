export interface CreateFarmInput {
  name: string;
  description?: string;
  state: string;
  city: string;
  address?: string;
  latitude: number;
  longitude: number;
  totalAreaHectares: number;
  boundaryCoords?: object | null;
}

export interface UpdateFarmInput extends Partial<CreateFarmInput> {}

export interface FarmWithCrops {
  id: string;
  name: string;
  description: string | null;
  state: string;
  city: string;
  address: string | null;
  latitude: number;
  longitude: number;
  totalAreaHectares: number;
  boundaryCoords: object | null;
  createdAt: Date;
  updatedAt: Date;
  crops: {
    id: string;
    type: string;
    currentStage: string;
  }[];
}
