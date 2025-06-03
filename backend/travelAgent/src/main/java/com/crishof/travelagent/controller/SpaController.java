package com.crishof.travelagent.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaController {

    @RequestMapping({
            "/{path:^(?!api$)(?!api/)(?!index\\.html$)(?!.*\\.).*$}",
            "/**/{path:^(?!api$)(?!api/)(?!index\\.html$)(?!.*\\.).*$}"
    })
    public String redirect() {
        return "forward:/index.html";
    }
}