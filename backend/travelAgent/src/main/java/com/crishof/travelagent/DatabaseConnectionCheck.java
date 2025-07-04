package com.crishof.travelagent;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

@Component
@RequiredArgsConstructor
public class DatabaseConnectionCheck implements ApplicationRunner {

    private final DataSource dataSource;

    @Override
    public void run(ApplicationArguments args) {
        try (Connection conn = dataSource.getConnection()) {
            boolean valid = conn.isValid(3);
            System.out.println(">>> Verificación de conexión a la base de datos: " + (valid ? "EXITOSA" : "FALLÓ"));
        } catch (SQLException e) {
            System.err.println(">>> ERROR al conectar con la base de datos:");
            e.printStackTrace();
        }
    }
}
