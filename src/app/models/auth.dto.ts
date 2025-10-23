export interface GoogleLoginRequest {
  idToken: string;
}

export interface AuthResponse {
  token?: string;
  error?: string;
}

export interface AuthSuccess extends AuthResponse {
  token: string;
}

export interface AuthError extends AuthResponse {
  error: string;
}
