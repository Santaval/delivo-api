export interface ClientResponse {
  id: string;
  name: string;
  phoneNumber?: string;
  email?: string;
  location: {
    lat: number | null;
    lng: number | null;
  };
  companyId: string;
  createdAt: string;
  updatedAt: string;
}
