package org.example.orders;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record CreateOrderRequest(
        @NotNull Long userId,
        @NotEmpty @Valid List<OrderLineItem> items,
        Boolean failPayment
) {
}
