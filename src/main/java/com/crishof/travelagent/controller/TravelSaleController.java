package com.crishof.travelagent.controller;

import com.crishof.travelagent.service.TravelSaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/travelSale")
@RequiredArgsConstructor
public class TravelSaleController {

    private final TravelSaleService travelSaleService;
}
