package org.example.users;

import java.time.Instant;

public record UserResponse(Long id, String email, String name, Instant createdAt) {

    static UserResponse from(User user) {
        return new UserResponse(user.getId(), user.getEmail(), user.getName(), user.getCreatedAt());
    }
}
