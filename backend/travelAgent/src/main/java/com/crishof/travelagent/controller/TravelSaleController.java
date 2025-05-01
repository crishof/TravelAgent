package com.crishof.travelagent.controller;

import com.crishof.travelagent.dto.TravelSaleRequest;
import com.crishof.travelagent.dto.TravelSaleResponse;
import com.crishof.travelagent.service.TravelSaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/travelSale")
@RequiredArgsConstructor
public class TravelSaleController {

    private final TravelSaleService travelSaleService;

    @GetMapping("/getAll")
    public ResponseEntity<List<TravelSaleResponse>> getAll() {
        return ResponseEntity.ok(travelSaleService.getAll());
    }

    @GetMapping("getById/{id}")
    public ResponseEntity<TravelSaleResponse> getById(@PathVariable("id") long id) {
        return ResponseEntity.ok(travelSaleService.getById(id));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<TravelSaleResponse> update(@PathVariable("id") long id, @RequestBody TravelSaleRequest travelSaleRequest) {
        return ResponseEntity.ok(travelSaleService.update(id, travelSaleRequest));
    }

    @PostMapping("/save")
    public ResponseEntity<TravelSaleResponse> save(@RequestBody TravelSaleRequest travelSaleRequest) {
        System.out.println("travelSaleRequest = " + travelSaleRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(travelSaleService.create(travelSaleRequest));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable("id") long id) {
        return ResponseEntity.status(HttpStatus.OK).body(travelSaleService.delete(id));
    }
}
