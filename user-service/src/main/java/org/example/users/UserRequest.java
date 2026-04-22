package org.example.users;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserRequest(
        @NotBlank @Email String email,
        @NotBlank String name,
        /** If omitted, default password {@code password} is used (dev only). */
        @Size(min = 8, max = 128) String password
) {
}
