package org.example.gateway;

import org.springframework.http.HttpMethod;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.server.resource.web.server.authentication.ServerBearerTokenAuthenticationConverter;
import org.springframework.security.web.server.authentication.ServerAuthenticationConverter;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

/**
 * For routes that are {@code permitAll()} in {@link GatewaySecurityConfig}, the default OAuth2
 * resource-server filter still validates a {@code Bearer} token if the client sends one. An
 * expired or invalid JWT then yields 401 before the authorization layer runs — which breaks
 * public {@code GET /api/products} for logged-in users whose token expired.
 * <p>
 * On those public paths we skip bearer extraction so the request is treated as anonymous and
 * {@code permitAll} applies. All other paths delegate to the standard converter.
 */
@Component
public class PublicPathsBearerTokenConverter implements ServerAuthenticationConverter {

    private final ServerAuthenticationConverter delegate = new ServerBearerTokenAuthenticationConverter();

    @Override
    public Mono<Authentication> convert(ServerWebExchange exchange) {
        var req = exchange.getRequest();
        String path = req.getURI().getPath();
        HttpMethod method = req.getMethod();

        if (path.startsWith("/api/auth/")) {
            return Mono.empty();
        }
        if (HttpMethod.POST.equals(method) && "/api/users".equals(path)) {
            return Mono.empty();
        }
        if (HttpMethod.GET.equals(method) && path.startsWith("/api/products")) {
            return Mono.empty();
        }
        return delegate.convert(exchange);
    }
}
