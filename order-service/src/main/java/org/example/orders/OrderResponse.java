package org.example.orders;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderResponse(
        Long id,
        Long userId,
        OrderStatus status,
        BigDecimal totalAmount,
        Instant createdAt,
        List<OrderLineResponse> lines
) {

    static OrderResponse from(OrderEntity order) {
        List<OrderLineResponse> lineResponses = order.getLines().stream()
                .map(OrderLineResponse::from)
                .toList();
        return new OrderResponse(
                order.getId(),
                order.getUserId(),
                order.getStatus(),
                order.getTotalAmount(),
                order.getCreatedAt(),
                lineResponses
        );
    }
}
