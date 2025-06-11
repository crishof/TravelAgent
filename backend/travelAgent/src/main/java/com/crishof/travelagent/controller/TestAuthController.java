package com.crishof.travelagent.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/testAuth")
public class TestAuthController {

    @GetMapping("/testPublic")
    public String sayHello() {
        return "Hello from API PUBLIC";
    }

    @GetMapping("/testProtected")
    public String sayHelloProtected() {
        return "Hello from API PROTECTED";
    }
}
