// src/main/java/com/worldcup2030/backend/controller/UserController.java
package com.worldcup2030.backend.controller;

import com.worldcup2030.backend.model.User;
import com.worldcup2030.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")  // autorise Angular en dev
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Retourne l'utilisateur correspondant à l'email donné.
     * Exemple : GET /api/users/email/med@gmail.com
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<User> getByEmail(@PathVariable String email) {
        return userRepository.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
