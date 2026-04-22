package org.example.users;

public record TokenResponse(String accessToken, String tokenType, long expiresInSeconds) {
}
