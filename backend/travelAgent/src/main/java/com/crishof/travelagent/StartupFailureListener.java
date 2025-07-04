package com.crishof.travelagent;

import org.springframework.boot.context.event.ApplicationFailedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class StartupFailureListener {

    @EventListener
    public void handleContextFailure(ApplicationFailedEvent event) {
        System.err.println(">>> ERROR CRÍTICO: Falló el arranque de Spring");
        Throwable exception = event.getException();
        exception.printStackTrace();
    }
}
