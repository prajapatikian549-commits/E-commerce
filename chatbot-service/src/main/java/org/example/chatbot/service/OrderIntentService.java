package org.example.chatbot.service;

import org.example.chatbot.dto.order.OrderApiResponse;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
public class OrderIntentService {

    private static final Pattern ORDER_ID =
            Pattern.compile("(?i)(?:\\border\\s*(?:#|(?:id|number)\\s*:?\\s*)?|\\#)\\s*(\\d{1,18})\\b");
    private static final Pattern LIST_ORDERS = Pattern.compile(
            "(?i)\\b(?:my|list|show|all|get)\\s+(?:all\\s+)?orders?\\b|\\borders?\\s+(?:list|history)\\b");

    public Optional<Long> extractOrderId(String message) {
        var m = ORDER_ID.matcher(message);
        if (m.find()) {
            try {
                return Optional.of(Long.parseLong(m.group(1)));
            } catch (NumberFormatException ignored) {
                return Optional.empty();
            }
        }
        return Optional.empty();
    }

    public boolean isListOrdersIntent(String message) {
        return LIST_ORDERS.matcher(message).find();
    }

    public String formatOrder(OrderApiResponse order) {
        int lineCount = order.lines() == null ? 0 : order.lines().size();
        return "Order #" + order.id()
                + " — status: " + order.status()
                + ", total: " + order.totalAmount()
                + ", lines: " + lineCount
                + ", placed: " + order.createdAt() + ".";
    }

    public String formatOrderList(List<OrderApiResponse> orders) {
        if (orders == null || orders.isEmpty()) {
            return "There are no orders in the system yet.";
        }
        int n = orders.size();
        StringBuilder sb = new StringBuilder();
        sb.append("Found ").append(n).append(" order(s). ");
        int limit = Math.min(5, n);
        sb.append("Showing up to ").append(limit).append(": ");
        for (int i = 0; i < limit; i++) {
            OrderApiResponse o = orders.get(i);
            if (i > 0) {
                sb.append("; ");
            }
            sb.append("#").append(o.id()).append(" (").append(o.status()).append(", ").append(o.totalAmount()).append(")");
        }
        if (n > limit) {
            sb.append(" …and ").append(n - limit).append(" more.");
        }
        return sb.toString();
    }
}
