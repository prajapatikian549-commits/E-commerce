package org.example.chatbot.feign;

import org.example.chatbot.dto.order.OrderApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "order-service")
public interface OrderServiceClient {

    @GetMapping("/api/orders/{id}")
    OrderApiResponse getOrder(@PathVariable("id") Long id);

    @GetMapping("/api/orders")
    List<OrderApiResponse> listOrders();
}
