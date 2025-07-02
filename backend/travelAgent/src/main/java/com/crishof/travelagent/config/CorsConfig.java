//package com.crishof.travelagent.config;
//
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.cors.CorsConfiguration;
//import org.springframework.web.cors.CorsConfigurationSource;
//import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
//import org.springframework.web.servlet.config.annotation.CorsRegistry;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//
//import java.util.List;
//
//@Configuration
//public class CorsConfig {
//    @Value("${spring.profiles.active:prod}")
//
//    private String activeProfile;
//
//    private final String[] allowedMethods = new String[]{"GET", "POST", "PUT", "DELETE", "OPTIONS"};
//
//    @Bean
//    public WebMvcConfigurer corsConfigurer() {
//        return new WebMvcConfigurer() {
//            @Override
//            public void addCorsMappings(CorsRegistry registry) {
//
//                // Entorno local
//                if ("dev".equalsIgnoreCase(activeProfile)) {
//                    registry.addMapping("/api/**")
//                            .allowedOrigins("http://localhost:4200")
//                            .allowedMethods(allowedMethods)
//                            .allowedHeaders("*")
//                            .allowCredentials(true);
//                }
//
//                // Producción
//                else {
//                    registry.addMapping("/api/**")
//                            .allowedOriginPatterns("https://*.vercel.app")
//                            .allowedMethods(allowedMethods)
//                            .allowedHeaders("*")
//                            .allowCredentials(true);
//                }
//            }
//        };
//    }
//
//
//    @Bean
//    public CorsConfigurationSource corsConfigurationSource() {
//        CorsConfiguration config = new CorsConfiguration();
//
//        if ("dev".equalsIgnoreCase(activeProfile)) {
//            config.setAllowedOrigins(List.of("http://localhost:4200"));
//        } else {
//            config.setAllowedOriginPatterns(List.of("https://*.vercel.app"));
//        }
//
//        config.setAllowedMethods(List.of(allowedMethods));
//        config.setAllowedHeaders(List.of("*"));
//        config.setAllowCredentials(true);
//
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        source.registerCorsConfiguration("/**", config);
//        return source;
//    }
//}