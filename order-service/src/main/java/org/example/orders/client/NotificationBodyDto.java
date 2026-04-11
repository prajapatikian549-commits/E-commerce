package org.example.orders.client;

public record NotificationBodyDto(Long orderId, String event) {
}
