package com.crishof.travelagent;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class StartupCheck implements ApplicationRunner {

    @Override
    public void run(ApplicationArguments args) {
        System.out.println(">>> StartupCheck: La aplicación llegó al punto de ejecución.");
    }
}
