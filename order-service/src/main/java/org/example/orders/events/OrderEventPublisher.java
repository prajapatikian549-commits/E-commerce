package org.example.orders.events;

@FunctionalInterface
public interface OrderEventPublisher {

    void publishOrderConfirmed(long orderId);
}
