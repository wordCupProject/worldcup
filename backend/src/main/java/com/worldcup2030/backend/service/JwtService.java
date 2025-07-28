package com.worldcup2030.backend.service;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import com.worldcup2030.backend.model.User;

@Service
public class JwtService {

    private Key key;

    @PostConstruct
    public void init() {
        // Génération automatique d'une clé secrète pour la signature HS256
        this.key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    }

    // Génération d'un token JWT à partir d'un utilisateur personnalisé
    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("email", user.getEmail());

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getEmail()) // Le sujet est l'email
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // Expire dans 24h
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // Extraction de l'email (subject) depuis le token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Extraction de l'ID utilisateur stocké dans les claims personnalisés
    public Long extractUserId(String token) {
        Claims claims = extractAllClaims(token);
        return claims.get("userId", Long.class);
    }

    // Extraction générique d'une information depuis les claims
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Validation simple du token par comparaison de l'email et expiration
    public boolean isTokenValid(String token, User user) {
        final String username = extractUsername(token);
        return (username.equals(user.getEmail())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Extraction de tous les claims à partir du token JWT
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Méthode optionnelle pour debugger un token dans la console
    public void debugToken(String token) {
        try {
            Claims claims = extractAllClaims(token);
            System.out.println("=== JWT DEBUG ===");
            System.out.println("Subject (email): " + claims.getSubject());
            System.out.println("UserId: " + claims.get("userId"));
            System.out.println("Issued at: " + claims.getIssuedAt());
            System.out.println("Expiration: " + claims.getExpiration());
            System.out.println("=================");
        } catch (Exception e) {
            System.out.println("Invalid token: " + e.getMessage());
        }
    }
}
