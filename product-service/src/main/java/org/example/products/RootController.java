package org.example.products;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Landing response for {@code GET /}; the product API lives under {@code /api/products}.
 */
@RestController
public class RootController {

    @GetMapping("/")
    public Map<String, Object> root() {
        return Map.of(
                "service", "product-service",
                "products", "/api/products",
                "health", "/actuator/health"
        );
    }
}
