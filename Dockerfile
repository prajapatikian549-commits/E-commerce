# Multi-module Maven build: requires full repo context (parent + modules listed in root pom.xml).
# Build stage
FROM maven:3.9.9-eclipse-temurin-21-alpine AS build
WORKDIR /app

COPY pom.xml .
COPY ecommerce-common ./ecommerce-common
COPY eureka-server ./eureka-server
COPY api-gateway ./api-gateway
COPY user-service ./user-service
COPY product-service ./product-service
COPY order-service ./order-service
COPY payment-service ./payment-service
COPY notification-service ./notification-service

# Bump the echo string after changing product-service sources if Render keeps using a stale cached layer.
RUN mvn -B -ntp clean package -pl product-service -am -DskipTests \
    && echo "docker-build-v3"

# Runtime — glibc-based image for broader JDBC/native compatibility than Alpine musl
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

COPY --from=build /app/product-service/target/product-service-1.0-SNAPSHOT.jar app.jar

# Local default port; on Render use PORT via application.yml (${PORT:8082})
EXPOSE 8082

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
