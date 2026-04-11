package org.example.payments;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/internal/payments")
public class PaymentController {

    /**
     * Stub: succeeds unless amount exceeds {@value #FAIL_THRESHOLD} or {@code fail=true}.
     */
    private static final BigDecimal FAIL_THRESHOLD = new BigDecimal("100000.00");

    @PostMapping
    public PaymentResponse pay(
            @Valid @RequestBody PaymentRequest request,
            @RequestParam(name = "fail", defaultValue = "false") boolean forceFail
    ) {
        if (forceFail || request.amount().compareTo(FAIL_THRESHOLD) > 0) {
            return new PaymentResponse(
                    "FAILED",
                    request.orderId(),
                    request.amount(),
                    "Payment declined (stub)"
            );
        }
        return new PaymentResponse(
                "SUCCESS",
                request.orderId(),
                request.amount(),
                "Payment captured (stub)"
        );
    }
}
