# Etapa 1: Construcción del JAR
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Etapa 2: Imagen final para producción
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# Copiar el JAR generado
COPY --from=builder /app/target/travelAgent-0.0.1-SNAPSHOT.jar app.jar

# Puerto estándar para Railway
EXPOSE 8080

# Instrucción de inicio
ENTRYPOINT ["java", "-jar", "app.jar"]