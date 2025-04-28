export interface User {
    id: string;
    ip: string;
    nickname: string;
    password: string; // hashed
    createdAt: Date;
  }  