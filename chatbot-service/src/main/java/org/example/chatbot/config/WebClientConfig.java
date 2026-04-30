package org.example.chatbot.config;

import io.netty.channel.ChannelOption;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;

@Configuration
public class WebClientConfig {

    @Bean
    public WebClient ollamaWebClient(ChatbotProperties properties) {
        var o = properties.getOllama();
        HttpClient httpClient = HttpClient.create()
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, o.getConnectTimeoutMs())
                .responseTimeout(Duration.ofMillis(o.getReadTimeoutMs()));
        return WebClient.builder()
                .baseUrl(o.getBaseUrl())
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();
    }

    @Bean
    public WebClient geminiWebClient(ChatbotProperties properties) {
        var g = properties.getGemini();
        HttpClient httpClient = HttpClient.create()
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, g.getConnectTimeoutMs())
                .responseTimeout(Duration.ofMillis(g.getReadTimeoutMs()));
        return WebClient.builder()
                .baseUrl(g.getBaseUrl())
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();
    }
}
