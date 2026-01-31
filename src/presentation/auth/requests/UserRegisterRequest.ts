export interface UserRegisterRequest {
  email: string;
  password: string;
  name: string;
  surnames: string;
  birthdate: string;
  gender: "male" | "female" | "other";
}
