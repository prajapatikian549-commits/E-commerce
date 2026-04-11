package org.example.orders.client;

import java.time.Instant;

public record UserDto(Long id, String email, String name, Instant createdAt) {
}
