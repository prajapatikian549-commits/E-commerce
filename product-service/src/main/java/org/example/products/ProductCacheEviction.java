package org.example.products;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Component;

@Component
public class ProductCacheEviction {

    @CacheEvict(cacheNames = "products", allEntries = true)
    public void evictAll() {
        // Annotation-driven eviction; method body unused.
    }
}
