package com.worldcup2030.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @RequestMapping("/")
    public ResponseEntity<String> home() {
        return ResponseEntity.ok("Bienvenue sur l'API WorldCup2030 !");
    }
}
