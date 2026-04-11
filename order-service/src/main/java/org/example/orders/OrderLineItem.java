package org.example.orders;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record OrderLineItem(
        @NotNull Long productId,
        @NotNull @Min(1) Integer quantity
) {
}
