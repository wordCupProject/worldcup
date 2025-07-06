package com.worldcup2030.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.worldcup2030.backend.service.UserService;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;

@RestController
@RequestMapping("/api/auth/oauth2")
public class OAuth2Controller {

    @Autowired
    private UserService userService;

    @GetMapping("/success")
    public ResponseEntity<?> getUserInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()
            || authentication instanceof AnonymousAuthenticationToken) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Utilisateur non authentifié");
        }

        if (!(authentication instanceof OAuth2AuthenticationToken oauth2Token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Type d'authentification inattendu");
        }

        OAuth2User user = oauth2Token.getPrincipal();

        Boolean emailVerified = user.getAttribute("email_verified");
        if (emailVerified == null || !emailVerified) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Email non vérifié par Google");
        }

        String email = user.getAttribute("email");
        String firstName = user.getAttribute("given_name");
        String lastName = user.getAttribute("family_name");

        // 🔁 Appel au UserService centralisé
        String token = userService.loginOrRegisterOauthUser(email, firstName, lastName);

        Map<String, String> response = new HashMap<>();
        response.put("email", email);
        response.put("firstName", firstName);
        response.put("lastName", lastName);
        response.put("token", token);

        String redirectUrl = "http://localhost:4200/oauth2-redirect" +
                     "?token=" + token +
                     "&firstName=" + firstName +
                     "&lastName=" + lastName +
                     "&email=" + email;

            return ResponseEntity.status(HttpStatus.FOUND)
                    .header("Location", redirectUrl)
                    .build();

                }
}
