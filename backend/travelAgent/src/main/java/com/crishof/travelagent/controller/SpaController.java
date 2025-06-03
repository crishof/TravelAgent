package com.crishof.travelagent.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
public class SpaController {

    @RequestMapping(value = {"/{path:[^\\.]*}"})
    public String redirect(@PathVariable(required = false) String path) {
        return "forward:/index.html";
    }
}