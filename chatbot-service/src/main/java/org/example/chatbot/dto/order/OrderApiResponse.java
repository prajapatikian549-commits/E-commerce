package org.example.chatbot.dto.order;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record OrderApiResponse(
        Long id,
        Long userId,
        String status,
        BigDecimal totalAmount,
        Instant createdAt,
        List<OrderLineApiResponse> lines
) {
}
