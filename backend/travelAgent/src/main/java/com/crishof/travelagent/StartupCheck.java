package com.crishof.travelagent;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class StartupCheck implements ApplicationRunner {

    private static final Logger logger = LoggerFactory.getLogger(StartupCheck.class);

    @Override
    public void run(ApplicationArguments args) {
        logger.info(">>> StartupCheck: La aplicación llegó al punto de ejecución.");
    }
}
