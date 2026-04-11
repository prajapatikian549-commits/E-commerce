package org.example.orders;

import java.math.BigDecimal;

public record OrderLineResponse(Long id, Long productId, int quantity, BigDecimal unitPrice) {

    static OrderLineResponse from(OrderLineEntity line) {
        return new OrderLineResponse(line.getId(), line.getProductId(), line.getQuantity(), line.getUnitPrice());
    }
}
