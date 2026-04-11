package org.example.notifications;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record NotificationRequest(
        @NotNull Long orderId,
        @NotBlank String event
) {
}
