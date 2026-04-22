package org.example.payments;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Idempotent payment orchestration: same {@code orderId} always yields the same outcome,
 * so saga retries or duplicate HTTP calls do not double-charge (stub semantics).
 */
@Service
public class PaymentProcessingService {

    private static final BigDecimal FAIL_THRESHOLD = new BigDecimal("100000.00");

    private final ConcurrentHashMap<Long, PaymentResponse> outcomes = new ConcurrentHashMap<>();

    public PaymentResponse pay(PaymentRequest request, boolean forceFail) {
        return outcomes.computeIfAbsent(request.orderId(), id -> executePay(request, forceFail));
    }

    private PaymentResponse executePay(PaymentRequest request, boolean forceFail) {
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
