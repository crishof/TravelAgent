# Etapa 1: Construcción del JAR usando Maven
FROM eclipse-temurin:17-jdk-jammy AS builder
WORKDIR /app

# Copiar archivos del proyecto
COPY . .

# Compilar el proyecto con Maven Wrapper
RUN ./mvnw clean package -DskipTests

# Etapa 2: Imagen final liviana
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copiar el JAR generado desde la etapa de compilación
COPY --from=builder /app/target/travelAgent-0.0.1.jar travelAgent.jar

LABEL authors="cristian"
EXPOSE 8080
ENV SPRING_PROFILES_ACTIVE=prod

# Ejecutar la aplicación (con uso de memoria optimizado)
CMD ["java", "-XX:MaxRAMPercentage=75.0", "-jar", "travelAgent.jar"]