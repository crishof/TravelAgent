# Etapa 1: Construcción del JAR usando Maven
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Etapa 2: Imagen final liviana
FROM openjdk:17-jdk-slim
WORKDIR /app

# Copia el JAR compilado desde el builder
COPY --from=builder /app/target/travelAgent-0.0.1.jar travelAgent.jar

LABEL authors="cristian"
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "travelAgent.jar"]