export interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  isAdmin?: boolean;
}
