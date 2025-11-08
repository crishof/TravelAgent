package com.crishof.travelagent.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    private static final Logger logger = LoggerFactory.getLogger(JwtService.class);
    private static final int CLOCK_SKEW_SECONDS = 30;

    @Value("${jwt.secret_key}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    @Value("${jwt.refresh-expiration}")
    private long refreshExpiration;

    @PostConstruct
    public void logValues() {
//        logger.info("✅ Access Token Expiration (ms): {}", jwtExpiration);
//        logger.info("✅ Refresh Token Expiration (ms): {}", refreshExpiration);
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
//        logger.info("🔐 Generando access token para usuario: {}", userDetails.getUsername());
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateRefreshToken(UserDetails userDetails) {
//        logger.info("🔁 Generando refresh token para usuario: {}", userDetails.getUsername());
        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + refreshExpiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String getUserName(String token) {
//        logger.info("📤 Extrayendo username del token");
        return getClaim(token, Claims::getSubject);
    }

    public boolean isTokenValid(String token) {
//        logger.info("✅ Validando token");
        try {
            getAllClaims(token);
            return true;
        } catch (ExpiredJwtException e) {
//            logger.warn("⚠️ Token expirado: {}", e.getMessage());
            return false;
        } catch (JwtException e) {
//            logger.warn("❌ Token inválido: {}", e.getMessage());
            return false;
        }
    }

    public <T> T getClaim(String token, Function<Claims, T> claimsResolver) {
//        logger.info("📦 Extrayendo claim específico del token");
        final Claims claims = getAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims getAllClaims(String token) {
//        logger.info("🧠 Parseando y extrayendo todos los claims del token");
        Date now = new Date();
//        logger.info("🧠 Parseando claims - ahora: {}", now);
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .setAllowedClockSkewSeconds(CLOCK_SKEW_SECONDS)
                .build()
                .parseClaimsJws(token)
                .getBody();
//        logger.info("📆 Token expira en: {}", claims.getExpiration());
        return claims;
    }

    private Key getSignInKey() {
//        logger.info("🔑 Obteniendo clave secreta para firmar/validar el token");
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}