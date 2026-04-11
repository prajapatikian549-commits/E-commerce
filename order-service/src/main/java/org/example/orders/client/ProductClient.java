package org.example.orders.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "product-service")
public interface ProductClient {

    @GetMapping("/api/products/{id}")
    ProductDto getProduct(@PathVariable("id") Long id);

    @PostMapping("/api/internal/products/{id}/reserve")
    ProductDto reserve(@PathVariable("id") Long id, @RequestBody QuantityDto body);

    @PostMapping("/api/internal/products/{id}/release")
    ProductDto release(@PathVariable("id") Long id, @RequestBody QuantityDto body);
}
