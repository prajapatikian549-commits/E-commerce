package org.example.orders.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "payment-service")
public interface PaymentClient {

    @PostMapping("/api/internal/payments")
    PaymentResultDto pay(
            @RequestBody PaymentBodyDto request,
            @RequestParam(value = "fail", defaultValue = "false") boolean fail
    );
}
