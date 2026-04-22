package org.example.notifications;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(name = "app.notification.use-kafka", havingValue = "true")
public class OrderEventsKafkaListener {

    private static final Logger log = LoggerFactory.getLogger(OrderEventsKafkaListener.class);

    private final ObjectMapper objectMapper;

    public OrderEventsKafkaListener(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @KafkaListener(
            topics = "${app.kafka.order-events-topic:order-events}",
            groupId = "${spring.kafka.consumer.group-id:notification-service}"
    )
    public void onOrderEvent(String payload) {
        try {
            OrderConfirmedEvent event = objectMapper.readValue(payload, OrderConfirmedEvent.class);
            log.info("[notification-kafka] orderId={} event={}", event.orderId(), event.eventType());
        } catch (Exception e) {
            log.error("Failed to process order event payload={}", payload, e);
        }
    }
}
