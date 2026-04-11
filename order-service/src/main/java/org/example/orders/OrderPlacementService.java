package org.example.orders;

import feign.FeignException;
import org.example.orders.client.NotificationBodyDto;
import org.example.orders.client.NotificationClient;
import org.example.orders.client.PaymentBodyDto;
import org.example.orders.client.PaymentClient;
import org.example.orders.client.PaymentResultDto;
import org.example.orders.client.ProductClient;
import org.example.orders.client.ProductDto;
import org.example.orders.client.QuantityDto;
import org.example.orders.client.UserClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderPlacementService {

    private static final Logger log = LoggerFactory.getLogger(OrderPlacementService.class);

    private final UserClient userClient;
    private final ProductClient productClient;
    private final PaymentClient paymentClient;
    private final NotificationClient notificationClient;
    private final OrderRepository orderRepository;

    public OrderPlacementService(
            UserClient userClient,
            ProductClient productClient,
            PaymentClient paymentClient,
            NotificationClient notificationClient,
            OrderRepository orderRepository
    ) {
        this.userClient = userClient;
        this.productClient = productClient;
        this.paymentClient = paymentClient;
        this.notificationClient = notificationClient;
        this.orderRepository = orderRepository;
    }

    public OrderResponse placeOrder(CreateOrderRequest request) {
        userClient.getUser(request.userId());

        BigDecimal total = BigDecimal.ZERO;
        List<LineBuild> lines = new ArrayList<>();
        for (OrderLineItem item : request.items()) {
            ProductDto product = productClient.getProduct(item.productId());
            BigDecimal lineTotal = product.price().multiply(BigDecimal.valueOf(item.quantity()));
            total = total.add(lineTotal);
            lines.add(new LineBuild(item.productId(), item.quantity(), product.price()));
        }

        OrderEntity order = new OrderEntity();
        order.setUserId(request.userId());
        order.setStatus(OrderStatus.PENDING);
        order.setTotalAmount(total);
        for (LineBuild b : lines) {
            OrderLineEntity line = new OrderLineEntity();
            line.setProductId(b.productId());
            line.setQuantity(b.quantity());
            line.setUnitPrice(b.unitPrice());
            order.addLine(line);
        }
        order = orderRepository.save(order);

        List<ReservedItem> reserved = new ArrayList<>();
        try {
            for (LineBuild b : lines) {
                productClient.reserve(b.productId(), new QuantityDto(b.quantity()));
                reserved.add(new ReservedItem(b.productId(), b.quantity()));
            }

            boolean fail = Boolean.TRUE.equals(request.failPayment());
            PaymentResultDto payResult = paymentClient.pay(new PaymentBodyDto(order.getId(), total), fail);
            if (!"SUCCESS".equals(payResult.status())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, payResult.message());
            }

            order.setStatus(OrderStatus.CONFIRMED);
            orderRepository.save(order);

            try {
                notificationClient.notify(new NotificationBodyDto(order.getId(), "ORDER_CONFIRMED"));
            } catch (Exception e) {
                log.warn("Notification failed for order {}", order.getId(), e);
            }

            return OrderResponse.from(order);
        } catch (ResponseStatusException e) {
            compensate(reserved);
            markFailed(order);
            throw e;
        } catch (FeignException e) {
            compensate(reserved);
            markFailed(order);
            if (e.status() == 404) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Resource not found", e);
            }
            HttpStatus status = e.status() >= 400 && e.status() < 500
                    ? HttpStatus.BAD_REQUEST
                    : HttpStatus.BAD_GATEWAY;
            throw new ResponseStatusException(status, "Dependency call failed", e);
        } catch (Exception e) {
            compensate(reserved);
            markFailed(order);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }

    private void markFailed(OrderEntity order) {
        order.setStatus(OrderStatus.FAILED);
        orderRepository.save(order);
    }

    private void compensate(List<ReservedItem> reserved) {
        for (int i = reserved.size() - 1; i >= 0; i--) {
            ReservedItem r = reserved.get(i);
            try {
                productClient.release(r.productId(), new QuantityDto(r.quantity()));
            } catch (Exception ex) {
                log.error("Failed to release stock for product {} qty {}", r.productId(), r.quantity(), ex);
            }
        }
    }

    private record LineBuild(Long productId, int quantity, BigDecimal unitPrice) {
    }

    private record ReservedItem(Long productId, int quantity) {
    }
}
