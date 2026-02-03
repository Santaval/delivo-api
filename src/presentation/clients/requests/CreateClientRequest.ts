export interface CreateClientRequest {
  name: string;
  phoneNumber?: string;
  email?: string;
  lat: number | null;
  lng: number | null;
}
