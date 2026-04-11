package org.example.orders.client;

import java.math.BigDecimal;

public record PaymentResultDto(String status, Long orderId, BigDecimal amount, String message) {
}
