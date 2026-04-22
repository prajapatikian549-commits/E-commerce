package org.example.gateway;

import org.example.common.correlation.CorrelationIdConstants;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpRequestDecorator;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.UUID;

/**
 * Ensures every request has a correlation id (incoming header or generated) for distributed tracing in logs.
 * <p>
 * Gateway requests may use {@link org.springframework.http.ReadOnlyHttpHeaders}; {@code mutate().header(...)}
 * and {@code mutate().headers(h -> h.set(...))} both mutate that instance and throw {@link UnsupportedOperationException}.
 * We copy into a mutable {@link HttpHeaders} and wrap the request with {@link ServerHttpRequestDecorator}.
 */
@Component
public class CorrelationIdGatewayFilter implements GlobalFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest original = exchange.getRequest();
        List<String> incoming = original.getHeaders().get(CorrelationIdConstants.HEADER);
        String id = (incoming != null && !incoming.isEmpty() && !incoming.getFirst().isBlank())
                ? incoming.getFirst()
                : UUID.randomUUID().toString();

        HttpHeaders newHeaders = new HttpHeaders();
        newHeaders.addAll(original.getHeaders());
        newHeaders.set(CorrelationIdConstants.HEADER, id);

        ServerHttpRequest decorated = new ServerHttpRequestDecorator(original) {
            @Override
            public HttpHeaders getHeaders() {
                return newHeaders;
            }
        };

        exchange.getResponse().getHeaders().add(CorrelationIdConstants.HEADER, id);
        exchange.getAttributes().put(CorrelationIdConstants.MDC_KEY, id);

        return chain.filter(exchange.mutate().request(decorated).build());
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE;
    }
}
