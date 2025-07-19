package com.crishof.travelagent;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TravelAgentApplication {

    private static final Logger logger = LoggerFactory.getLogger(TravelAgentApplication.class);

    @Value("${server.port:8080}")
    private String port;

    public static void main(String[] args) {
        try {
            SpringApplication.run(TravelAgentApplication.class, args);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @PostConstruct
    public void logStartup() {
        logger.info(">>> Aplicacion iniciada correctamente");
        logger.info(">>> Puerto: {}", port);
    }
}