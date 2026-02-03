export interface UpdateClientRequest {
  id: string;
  name?: string;
  phoneNumber?: string;
  email?: string;
  lat?: number | null;
  lng?: number | null;
}
