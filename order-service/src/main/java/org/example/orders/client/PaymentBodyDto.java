package org.example.orders.client;

import java.math.BigDecimal;

public record PaymentBodyDto(Long orderId, BigDecimal amount) {
}
