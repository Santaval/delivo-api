import { UserRegisterRequest } from "./UserRegisterRequest";

export interface TherapistRegisterRequest extends UserRegisterRequest {
    yearsOfExperience: number;
    biography: string;
    modality: string;
    placeId: string;
}