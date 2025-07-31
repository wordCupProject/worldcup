package com.worldcup2030.backend.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.worldcup2030.backend.dto.LoginRequest;
import com.worldcup2030.backend.dto.RegisterRequest;
import com.worldcup2030.backend.model.User;
import com.worldcup2030.backend.service.JwtService;
import com.worldcup2030.backend.service.UserService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            System.out.println("📝 Registration request received for: " + request.getEmail());

            userService.register(request);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Inscription réussie");

            System.out.println("✅ Registration successful for: " + request.getEmail());
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            System.err.println("❌ Registration failed: " + e.getMessage());

            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            System.out.println("🔐 Login request received for: " + request.getEmail());

            String token = userService.login(request);

            // ✅ DIAGNOSTIC IMMÉDIAT : Tester le token généré
            System.out.println("🧪 Testing generated token...");


            // Vérifier l'extraction de l'ID utilisateur
            Long extractedUserId = jwtService.extractUserId(token);
            String extractedEmail = jwtService.extractUsername(token);

            System.out.println("🔍 Token validation results:");
            System.out.println("   - Extracted User ID: " + extractedUserId);
            System.out.println("   - Extracted Email: " + extractedEmail);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Connexion réussie");
            response.put("token", token);

            // ✅ AJOUT : Informations de debug dans la réponse (à supprimer en production)
            response.put("debug", Map.of(
                    "extractedUserId", extractedUserId,
                    "extractedEmail", extractedEmail
            ));

            System.out.println("✅ Login successful for: " + request.getEmail());
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            System.err.println("❌ Login failed: " + e.getMessage());

            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    // ✅ NOUVEAU : Endpoint de diagnostic JWT
    @PostMapping("/debug-token")
    public ResponseEntity<?> debugToken(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");
            if (token == null || token.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Token manquant"));
            }

            System.out.println("🔍 Debug token request received");

            // Effectuer le debug du token


            // Extraire les informations
            Long userId = jwtService.extractUserId(token);
            String email = jwtService.extractUsername(token);

            Map<String, Object> response = new HashMap<>();
            response.put("valid", userId != null && userId > 0);
            response.put("extractedUserId", userId);
            response.put("extractedEmail", email);


            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Token debug failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ✅ NOUVEAU : Test complet du système JWT
    @PostMapping("/test-jwt-system")
    public ResponseEntity<?> testJwtSystem(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email manquant"));
            }

            System.out.println("🧪 JWT system test for: " + email);

            // Trouver l'utilisateur
            Optional<User> userOpt = userService.findByEmail(email);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Utilisateur non trouvé"));
            }

            User user = userOpt.get();
            System.out.println("👤 Testing with user: ID=" + user.getId() + ", Email=" + user.getEmail());

            // Effectuer le test complet


            // Générer un nouveau token pour les tests
            String token = jwtService.generateToken(user);

            // Extraire immédiatement les données
            Long extractedUserId = jwtService.extractUserId(token);
            String extractedEmail = jwtService.extractUsername(token);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("originalUserId", user.getId());
            response.put("originalEmail", user.getEmail());
            response.put("extractedUserId", extractedUserId);
            response.put("extractedEmail", extractedEmail);
            response.put("userIdMatch", user.getId().equals(extractedUserId));
            response.put("emailMatch", user.getEmail().equals(extractedEmail));
            response.put("testToken", token);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ JWT system test failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ✅ NOUVEAU : Endpoint pour obtenir les infos utilisateur à partir du token
    @PostMapping("/user-from-token")
    public ResponseEntity<?> getUserFromToken(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");
            if (token == null || token.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Token manquant"));
            }

            System.out.println("👤 Getting user from token...");

            // Extraire l'ID utilisateur
            Long userId = jwtService.extractUserId(token);
            if (userId == null || userId <= 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "ID utilisateur invalide dans le token: " + userId));
            }

            // Trouver l'utilisateur dans la base de données
            Optional<User> userOpt = userService.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Utilisateur non trouvé avec l'ID: " + userId));
            }

            User user = userOpt.get();

            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("email", user.getEmail());
            response.put("firstName", user.getFirstName());
            response.put("lastName", user.getLastName());
            response.put("tokenUserId", userId);

            System.out.println("✅ User found: " + user.getEmail() + " (ID: " + user.getId() + ")");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Get user from token failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}