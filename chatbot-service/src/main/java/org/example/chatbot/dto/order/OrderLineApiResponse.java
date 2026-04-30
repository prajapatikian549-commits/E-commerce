package org.example.chatbot.dto.order;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.math.BigDecimal;

@JsonIgnoreProperties(ignoreUnknown = true)
public record OrderLineApiResponse(Long id, Long productId, int quantity, BigDecimal unitPrice) {
}
