package org.example.products;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

/**
 * Inserts demo catalog rows when the DB is empty (in-memory H2 starts empty on each deploy).
 */
@Component
@Order(0)
public class ProductSeedRunner implements ApplicationRunner {

    private final ProductRepository productRepository;

    public ProductSeedRunner(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (productRepository.count() > 0) {
            return;
        }

        productRepository.save(product("Wireless Mouse", "Ergonomic Bluetooth mouse", new BigDecimal("29.99"), 120));
        productRepository.save(product("USB-C Hub", "7-in-1 adapter with HDMI", new BigDecimal("45.50"), 80));
        productRepository.save(product("Mechanical Keyboard", "Hot-swap 75% layout", new BigDecimal("119.00"), 35));
    }

    private static Product product(String name, String description, BigDecimal price, int stock) {
        Product p = new Product();
        p.setName(name);
        p.setDescription(description);
        p.setPrice(price);
        p.setStock(stock);
        return p;
    }
}
