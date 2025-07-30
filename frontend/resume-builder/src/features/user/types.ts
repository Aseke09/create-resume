export interface UserType {
  profileImageUrl: string | undefined;
  id: string;
  name: string;
  email: string;
  token: string;
}

export interface UserUpdatePayload {
  name?: string;
  email?: string;
  profileImageId?: string;
}