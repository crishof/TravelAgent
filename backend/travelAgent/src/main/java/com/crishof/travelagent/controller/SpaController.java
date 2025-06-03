package com.crishof.travelagent.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {

    /**
     * Redirige todas las rutas no API y sin extensión a index.html
     * para que Angular maneje el enrutamiento.
     * <p>
     * Evita rutas como:
     * - /api/...
     * - /main.js, /styles.css, etc.
     * - /index.html (para prevenir StackOverflowError)
     */
    @GetMapping(value = "/{path:^(?!api)(?!index\\.html)(?!.*\\.).*$}")
    public String redirect() {
        return "forward:/index.html";
    }
}