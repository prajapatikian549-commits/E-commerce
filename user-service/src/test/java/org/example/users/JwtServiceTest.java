package org.example.users;

import org.junit.jupiter.api.Test;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

import static org.junit.jupiter.api.Assertions.assertTrue;

class JwtServiceTest {

    @Test
    void accessTokenJwtHeaderUsesHs256() {
        JwtService jwt = new JwtService(
                "ecommerce-dev-jwt-secret-change-in-prod-min-32b!",
                3600
        );
        String token = jwt.createAccessToken(1L, "a@b.com");
        String headerB64 = token.split("\\.")[0];
        byte[] decoded = Base64.getUrlDecoder().decode(padBase64Url(headerB64));
        String header = new String(decoded, StandardCharsets.UTF_8);
        assertTrue(header.contains("\"alg\":\"HS256\""), () -> "unexpected header: " + header);
    }

    private static String padBase64Url(String s) {
        int pad = (4 - s.length() % 4) % 4;
        return s + "=".repeat(pad);
    }
}
