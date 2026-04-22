package org.example.products;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/internal/products")
public class InternalStockController {

    private final ProductRepository productRepository;
    private final ProductCacheEviction productCacheEviction;

    public InternalStockController(ProductRepository productRepository, ProductCacheEviction productCacheEviction) {
        this.productRepository = productRepository;
        this.productCacheEviction = productCacheEviction;
    }

    @PostMapping("/{id}/reserve")
    @Transactional
    public ProductResponse reserve(@PathVariable Long id, @Valid @RequestBody QuantityRequest body) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        if (p.getStock() < body.quantity()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Insufficient stock");
        }
        p.setStock(p.getStock() - body.quantity());
        ProductResponse saved = ProductResponse.from(productRepository.save(p));
        productCacheEviction.evictAll();
        return saved;
    }

    @PostMapping("/{id}/release")
    @Transactional
    public ProductResponse release(@PathVariable Long id, @Valid @RequestBody QuantityRequest body) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        p.setStock(p.getStock() + body.quantity());
        ProductResponse saved = ProductResponse.from(productRepository.save(p));
        productCacheEviction.evictAll();
        return saved;
    }
}
