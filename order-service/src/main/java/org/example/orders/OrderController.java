package org.example.orders;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderRepository orderRepository;
    private final OrderPlacementService orderPlacementService;

    public OrderController(OrderRepository orderRepository, OrderPlacementService orderPlacementService) {
        this.orderRepository = orderRepository;
        this.orderPlacementService = orderPlacementService;
    }

    @GetMapping
    @Transactional(readOnly = true)
    public List<OrderResponse> list() {
        return orderRepository.findAll().stream().map(OrderResponse::from).toList();
    }

    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    public OrderResponse get(@PathVariable Long id) {
        return orderRepository.findById(id)
                .map(OrderResponse::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse create(@Valid @RequestBody CreateOrderRequest request) {
        return orderPlacementService.placeOrder(request);
    }
}
