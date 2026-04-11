package org.example.payments;

import java.math.BigDecimal;

public record PaymentResponse(String status, Long orderId, BigDecimal amount, String message) {
}
