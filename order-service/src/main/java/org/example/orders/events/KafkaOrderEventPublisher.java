package org.example.orders.events;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(name = "app.notification.use-kafka", havingValue = "true")
public class KafkaOrderEventPublisher implements OrderEventPublisher {

    private static final Logger log = LoggerFactory.getLogger(KafkaOrderEventPublisher.class);

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;
    private final String topic;

    public KafkaOrderEventPublisher(
            KafkaTemplate<String, String> kafkaTemplate,
            ObjectMapper objectMapper,
            @Value("${app.kafka.order-events-topic:order-events}") String topic
    ) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
        this.topic = topic;
    }

    @Override
    public void publishOrderConfirmed(long orderId) {
        try {
            OrderConfirmedEvent event = new OrderConfirmedEvent(orderId, "ORDER_CONFIRMED");
            String json = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(topic, String.valueOf(orderId), json)
                    .whenComplete((r, ex) -> {
                        if (ex != null) {
                            log.error("Failed to publish order event for orderId={}", orderId, ex);
                        }
                    });
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize order event orderId={}", orderId, e);
        }
    }
}
