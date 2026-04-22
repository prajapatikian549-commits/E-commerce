package org.example.orders.events;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(name = "app.notification.use-kafka", havingValue = "false", matchIfMissing = true)
public class NoOpOrderEventPublisher implements OrderEventPublisher {

    @Override
    public void publishOrderConfirmed(long orderId) {
        // Kafka notifications disabled; synchronous Feign path handles delivery.
    }
}
