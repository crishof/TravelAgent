package com.crishof.travelagent.tools;


import java.security.SecureRandom;
import java.util.Base64;

public class SecretKeyGenerator {
    public static void main(String[] args) {
        byte[] key = new byte[32]; // 256 bits (recomendado para HS256)
        new SecureRandom().nextBytes(key);
        String base64Key = Base64.getEncoder().encodeToString(key);
        System.out.println("Generated SECRET_KEY:\n" + base64Key);
    }
}
