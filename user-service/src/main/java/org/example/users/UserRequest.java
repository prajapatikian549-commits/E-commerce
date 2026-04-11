package org.example.users;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UserRequest(
        @NotBlank @Email String email,
        @NotBlank String name
) {
}
