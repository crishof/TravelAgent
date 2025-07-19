package com.crishof.travelagent;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationFailedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class StartupFailureListener {

    private static final Logger logger = LoggerFactory.getLogger(StartupFailureListener.class);

    @EventListener
    public void handleContextFailure(ApplicationFailedEvent event) {
        logger.error(">>> ERROR CRÍTICO: Falló el arranque de Spring");
        Throwable exception = event.getException();
        exception.printStackTrace();
    }
}
