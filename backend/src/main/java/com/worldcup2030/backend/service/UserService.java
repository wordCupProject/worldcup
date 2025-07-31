package com.worldcup2030.backend.service;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.worldcup2030.backend.dto.LoginRequest;
import com.worldcup2030.backend.dto.RegisterRequest;
import com.worldcup2030.backend.model.User;
import com.worldcup2030.backend.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email déjà utilisé");
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setCountry(request.getCountry());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("utilisateur");

        userRepository.save(user);
    }

    public String login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email introuvable"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Mot de passe incorrect");
        }

        // ✅ CORRECTION : Passer l'objet User complet au lieu de l'email
        System.out.println("🔍 Login successful for user:");
        System.out.println("   - ID: " + user.getId());
        System.out.println("   - Email: " + user.getEmail());
        System.out.println("   - Name: " + user.getFirstName() + " " + user.getLastName());

        String token = jwtService.generateToken(user);

        // Debug du token généré


        return token;
    }

    // Optionnel : méthode OAuth2 login ou inscription automatique
    public String loginOrRegisterOauthUser(String email, String firstName, String lastName) {
        Optional<User> existingUserOpt = userRepository.findByEmail(email);
        User user;

        if (existingUserOpt.isEmpty()) {
            // Créer un nouvel utilisateur
            user = new User();
            user.setEmail(email);
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setPassword("oauth2"); // selon logique métier
            user.setRole("utilisateur");
            user = userRepository.save(user); // Sauvegarder pour obtenir l'ID

            System.out.println("🆕 New OAuth2 user created:");
            System.out.println("   - ID: " + user.getId());
            System.out.println("   - Email: " + user.getEmail());
        } else {
            user = existingUserOpt.get();
            System.out.println("✅ Existing OAuth2 user found:");
            System.out.println("   - ID: " + user.getId());
            System.out.println("   - Email: " + user.getEmail());
        }

        // ✅ CORRECTION : Passer l'objet User complet
        return jwtService.generateToken(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // ✅ NOUVELLE MÉTHODE : Trouver un utilisateur par ID (utile pour validation)
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    // ✅ NOUVELLE MÉTHODE : Valider qu'un utilisateur existe
    public boolean existsById(Long id) {
        return userRepository.existsById(id);
    }
}