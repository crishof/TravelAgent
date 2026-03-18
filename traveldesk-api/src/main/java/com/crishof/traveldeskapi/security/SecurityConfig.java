package com.crishof.traveldeskapi.security;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private static final List<String> PUBLIC_ENDPOINTS = List.of("/swagger-ui/**", "/swagger-ui.html", "/v3/api-docs/**", "/api/v1/auth/**", "/actuator/health", "/api/v1/exchange-rate/**");
    private static final List<String> DEV_ALLOWED_ORIGINS = List.of("http://localhost:3000", "http://localhost:4200", "http://127.0.0.1:3000");
    private static final List<String> PROD_ALLOWED_ORIGINS = List.of("https://travel-desk.vercel.app");
    private static final List<String> ALLOWED_METHODS = List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS");
    private static final List<String> EXPOSED_HEADERS = List.of("Authorization");
    private static final List<String> ALL_HEADERS = List.of("*");
    private final JwtFilter jwtFilter;
    private final com.crishof.traveldeskapi.security.RestAuthenticationEntryPoint restAuthenticationEntryPoint;
    private final RestAccessDeniedHandler restAccessDeniedHandler;

    @Value("${spring.profiles.active:dev}")
    private String activeProfile;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) {
        try {
            return configuration.getAuthenticationManager();
        } catch (Exception ex) {
            throw new IllegalStateException("Failed to create AuthenticationManager", ex);
        }
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) {
        try {
            http.csrf(AbstractHttpConfigurer::disable)
                    .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                    .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                    .exceptionHandling(exceptions -> exceptions.authenticationEntryPoint(restAuthenticationEntryPoint)
                            .accessDeniedHandler(restAccessDeniedHandler))
                    .authorizeHttpRequests(auth -> auth.requestMatchers(PUBLIC_ENDPOINTS.toArray(String[]::new))
                            .permitAll()
                            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                            .requestMatchers("/actuator/**").hasRole("ADMIN")
                            .anyRequest().authenticated())
                    .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

            return http.build();
        } catch (Exception ex) {
            throw new IllegalStateException("Failed to configure Spring Security filter chain", ex);
        }
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        if (isDevProfile()) {
            configuration.setAllowedOrigins(DEV_ALLOWED_ORIGINS);
        } else {
            configuration.setAllowedOrigins(PROD_ALLOWED_ORIGINS);
        }

        configuration.setAllowedMethods(ALLOWED_METHODS);
        configuration.setAllowedHeaders(ALL_HEADERS);
        configuration.setExposedHeaders(EXPOSED_HEADERS);
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    private boolean isDevProfile() {
        return "dev".equalsIgnoreCase(activeProfile);
    }
}