package com.crishof.travelagent;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TravelAgentApplication {

    public static void main(String[] args) {
        try {
            SpringApplication.run(TravelAgentApplication.class, args);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @PostConstruct
    public void logStartup() {
        String port = System.getenv("PORT");
        System.out.println(">>> Aplicacion iniciada correctamente");
        System.out.println(">>> Puerto: " + port);
    }
}
