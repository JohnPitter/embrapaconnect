export interface FarmMapMarker {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  state: string;
  city: string;
  userId: string;
  userName: string;
  totalCrops: number;
  hasAlert: boolean;
}
