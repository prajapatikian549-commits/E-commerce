package org.example.orders.events;

public record OrderConfirmedEvent(long orderId, String eventType) {
}
