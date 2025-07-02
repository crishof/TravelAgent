# Etapa 1: Construcción del JAR usando Maven
FROM eclipse-temurin:21-jdk AS builder
WORKDIR /app
COPY . .
RUN ./mvnw clean package -DskipTests

# Etapa 2: Imagen final liviana
FROM eclipse-temurin:21-jdk
WORKDIR /app

# Copia el JAR compilado desde la etapa anterior
COPY --from=builder /app/target/travelAgent-0.0.1.jar travelAgent.jar

LABEL authors="cristian"
EXPOSE 8080
ENV SPRING_PROFILES_ACTIVE=prod
ENTRYPOINT ["java", "-jar", "travelAgent.jar"]