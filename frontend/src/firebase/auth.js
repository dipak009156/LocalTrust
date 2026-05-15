/**
 * JWT token helpers — replaces Firebase Auth.
 * Token is stored in localStorage after OTP verification.
 */

export const TOKEN_KEY = 'lt_token';

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
}

export function isLoggedIn() {
    return !!localStorage.getItem(TOKEN_KEY);
}