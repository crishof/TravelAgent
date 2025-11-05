package com.crishof.travelagent;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

@Component
@RequiredArgsConstructor
public class DatabaseConnectionCheck implements ApplicationRunner {

    private static final Logger LOGGER = LoggerFactory.getLogger(DatabaseConnectionCheck.class);
    private final DataSource dataSource;

    @Override
    public void run(ApplicationArguments args) {
        try (Connection conn = dataSource.getConnection()) {
            boolean valid = conn.isValid(3);
            LOGGER.info(">>> Verificación de conexión a la base de datos: {}", valid ? "EXITOSA" : "FALLÓ");
        } catch (SQLException e) {
            LOGGER.error(">>> ERROR al conectar con la base de datos", e);
        }
    }
}
