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

    // Durée de validité du token : 24 heures
    private static final long JWT_EXPIRATION = 1000 * 60 * 60 * 24;

    @PostConstruct
    public void init() {
        // Génération automatique d'une clé secrète pour la signature HS256
        this.key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
        System.out.println("✅ JWT Service initialized with secure key");
    }

    // Génération d'un token JWT à partir d'un utilisateur personnalisé
    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("email", user.getEmail());
        claims.put("role", user.getRole());

        String token = Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getEmail()) // Le sujet est l'email
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();

        System.out.println("✅ JWT Token generated for user: " + user.getEmail());
        return token;
    }

    // Extraction de l'email (subject) depuis le token
    public String extractUsername(String token) {
        try {
            return extractClaim(token, Claims::getSubject);
        } catch (Exception e) {
            System.out.println("❌ Error extracting username from token: " + e.getMessage());
            throw new JwtException("Token invalide", e);
        }
    }

    // Extraction de l'ID utilisateur stocké dans les claims personnalisés
    public Long extractUserId(String token) {
        try {
            Claims claims = extractAllClaims(token);
            return claims.get("userId", Long.class);
        } catch (Exception e) {
            System.out.println("❌ Error extracting user ID from token: " + e.getMessage());
            throw new JwtException("Token invalide", e);
        }
    }

    // Extraction générique d'une information depuis les claims
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Validation complète du token
    public boolean isTokenValid(String token, User user) {
        try {
            final String username = extractUsername(token);
            boolean isValid = (username.equals(user.getEmail())) && !isTokenExpired(token);

            if (isValid) {
                System.out.println("✅ JWT Token is valid for user: " + username);
            } else {
                System.out.println("❌ JWT Token validation failed for user: " + username);
                if (isTokenExpired(token)) {
                    System.out.println("❌ Token is expired");
                }
            }

            return isValid;
        } catch (Exception e) {
            System.out.println("❌ JWT Token validation error: " + e.getMessage());
            return false;
        }
    }

    // Vérification simple de validité du token (sans utilisateur)
    public boolean isTokenValid(String token) {
        try {
            extractAllClaims(token);
            boolean isValid = !isTokenExpired(token);

            if (!isValid) {
                System.out.println("❌ Token is expired");
            }

            return isValid;
        } catch (ExpiredJwtException e) {
            System.out.println("❌ Token is expired: " + e.getMessage());
            return false;
        } catch (Exception e) {
            System.out.println("❌ Token validation error: " + e.getMessage());
            return false;
        }
    }

    private boolean isTokenExpired(String token) {
        try {
            Date expiration = extractExpiration(token);
            boolean expired = expiration.before(new Date());

            if (expired) {
                System.out.println("❌ Token expired at: " + expiration);
            }

            return expired;
        } catch (Exception e) {
            System.out.println("❌ Error checking token expiration: " + e.getMessage());
            return true;
        }
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Extraction de tous les claims à partir du token JWT
    private Claims extractAllClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            System.out.println("❌ JWT Token expired: " + e.getMessage());
            throw e;
        } catch (UnsupportedJwtException e) {
            System.out.println("❌ JWT Token unsupported: " + e.getMessage());
            throw e;
        } catch (MalformedJwtException e) {
            System.out.println("❌ JWT Token malformed: " + e.getMessage());
            throw e;
        } catch (SecurityException e) {
            System.out.println("❌ JWT Token security error: " + e.getMessage());
            throw e;
        } catch (IllegalArgumentException e) {
            System.out.println("❌ JWT Token illegal argument: " + e.getMessage());
            throw e;
        }
    }

    // Méthode pour debugger un token dans la console
    public void debugToken(String token) {
        try {
            Claims claims = extractAllClaims(token);
            System.out.println("=== JWT DEBUG ===");
            System.out.println("Subject (email): " + claims.getSubject());
            System.out.println("UserId: " + claims.get("userId"));
            System.out.println("Role: " + claims.get("role"));
            System.out.println("Issued at: " + claims.getIssuedAt());
            System.out.println("Expiration: " + claims.getExpiration());
            System.out.println("Is expired: " + isTokenExpired(token));
            System.out.println("Current time: " + new Date());
            System.out.println("=================");
        } catch (Exception e) {
            System.out.println("❌ Invalid token debug: " + e.getMessage());
            System.out.println("Token: " + (token != null ? token.substring(0, Math.min(50, token.length())) + "..." : "null"));
        }
    }

    // Méthode utilitaire pour extraire le token d'un header Authorization
    public String extractTokenFromHeader(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }

    // Obtenir le temps d'expiration restant en millisecondes
    public long getExpirationTimeRemaining(String token) {
        try {
            Date expiration = extractExpiration(token);
            return expiration.getTime() - System.currentTimeMillis();
        } catch (Exception e) {
            return 0;
        }
    }
}