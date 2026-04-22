package org.example.payments;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/internal/payments")
public class PaymentController {

    private final PaymentProcessingService paymentProcessingService;

    public PaymentController(PaymentProcessingService paymentProcessingService) {
        this.paymentProcessingService = paymentProcessingService;
    }

    @PostMapping
    public PaymentResponse pay(
            @Valid @RequestBody PaymentRequest request,
            @RequestParam(name = "fail", defaultValue = "false") boolean forceFail
    ) {
        return paymentProcessingService.pay(request, forceFail);
    }
}
