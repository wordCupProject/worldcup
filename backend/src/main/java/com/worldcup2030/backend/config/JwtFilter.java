package com.worldcup2030.backend.config;

import com.worldcup2030.backend.model.User;
import com.worldcup2030.backend.repository.UserRepository;
import com.worldcup2030.backend.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        String contextPath = request.getContextPath();
        System.out.println("🔍 JwtFilter - Full URI: " + path + " | Context: " + contextPath);
        
        // Enlever le context path si présent
        String cleanPath = path;
        if (contextPath != null && !contextPath.isEmpty() && path.startsWith(contextPath)) {
            cleanPath = path.substring(contextPath.length());
        }
        System.out.println("🔍 JwtFilter - Clean path: " + cleanPath);
        
        // Après avoir retiré le context path /api, vérifier les chemins sans /api
        boolean shouldSkip = cleanPath.startsWith("/auth/") || 
                             cleanPath.startsWith("/register/") ||
                             cleanPath.equals("/hotels") ||
                             cleanPath.startsWith("/hotels/") ||
                             cleanPath.equals("/transports") ||
                             cleanPath.startsWith("/transports/");
        
        System.out.println("🔍 Should skip JWT filter: " + shouldSkip);
        return shouldSkip;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        // Si un token est présent, on essaie de l'authentifier
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            try {
                String email = jwtService.extractUsername(token);

                if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    User user = userRepository.findByEmail(email).orElse(null);

                    if (user != null && jwtService.isTokenValid(token, user)) {
                        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                                user.getEmail(),
                                null,
                                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole()))
                        );
                        SecurityContextHolder.getContext().setAuthentication(auth);
                        System.out.println("✅ JWT Authentication successful for user: " + email);
                    } else {
                        // Token invalide mais on continue quand même (laisse Spring Security décider)
                        System.out.println("⚠️ JWT Token validation failed for user: " + email);
                    }
                }
            } catch (Exception e) {
                // Erreur de parsing mais on continue (laisse Spring Security décider)
                System.out.println("⚠️ JWT Token parsing error: " + e.getMessage());
            }
        }

        // Toujours continuer la chaîne de filtres - Spring Security décidera si l'accès est autorisé
        filterChain.doFilter(request, response);
    }
}