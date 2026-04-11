package org.example.products;

import java.math.BigDecimal;

public record ProductResponse(Long id, String name, String description, BigDecimal price, int stock) {

    static ProductResponse from(Product p) {
        return new ProductResponse(p.getId(), p.getName(), p.getDescription(), p.getPrice(), p.getStock());
    }
}
