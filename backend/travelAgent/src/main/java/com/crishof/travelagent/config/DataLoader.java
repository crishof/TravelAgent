package com.crishof.travelagent.config;

import com.crishof.travelagent.model.*;
import com.crishof.travelagent.repository.*;
import com.crishof.travelagent.service.CurrencyConversionService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Component
@Profile("dev")
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final AgencyRepository agencyRepository;
    private final SupplierRepository supplierRepository;
    private final CustomerRepository customerRepository;
    private final TravelSaleRepository travelSaleRepository;
    private final BookingRepository bookingRepository;
    private final PasswordEncoder passwordEncoder;
    private final CurrencyConversionService currencyConversionService;

    private final Random random = new Random();
    Logger logger = LoggerFactory.getLogger(DataLoader.class);
    private BigDecimal usdToEuroRate;
    private BigDecimal euroToUsdRate;

    @Override
    public void run(String... args) {
        logger.info("🚀 DataLoader iniciado (dev)");

        try {
            usdToEuroRate = currencyConversionService.getExchangeRateSync("USD", "EUR");
            euroToUsdRate = currencyConversionService.getExchangeRateSync("EUR", "USD");
        } catch (Exception e) {
            usdToEuroRate = BigDecimal.valueOf(0.92);
            euroToUsdRate = BigDecimal.valueOf(1.08);
            logger.info("⚠️ No se pudo obtener tasa de cambio en DataLoader, usando valores por defecto.");
        }

        // Crear usuario admin y agencia
        Agency agency = agencyRepository.findByName("Beat Travel").orElseGet(() -> {
            Agency a = new Agency();
            a.setName("Beat Travel");
            return agencyRepository.save(a);
        });

        User admin = userRepository.findByEmail("cris@mail.com").orElseGet(() -> {
            User u = new User();
            u.setFirstName("Cristian");
            u.setLastName("Hoffmann");
            u.setEmail("cris@mail.com");
            u.setPassword(passwordEncoder.encode("112233"));
            u.setAgency(agency);
            u.setRole(Role.ADMIN);
            return userRepository.save(u);
        });

        // Crear proveedores
        Map<String, String> suppliers = Map.ofEntries(
                Map.entry("CDV", "EUR"),
                Map.entry("Aertickets", "EUR"),
                Map.entry("Starling", "USD"),
                Map.entry("Mitika", "USD"),
                Map.entry("MyTransfers", "USD"),
                Map.entry("Civitatis", "EUR"),
                Map.entry("WelcomeBeds", "EUR"),
                Map.entry("WorldToMeet", "EUR")
        );

        suppliers.forEach((name, currency) -> {
            if (supplierRepository.findBySupplierName(name).isEmpty()) {
                Supplier s = new Supplier();
                s.setSupplierName(name);
                s.setCurrency(currency);
                s.setAgency(agency);
                supplierRepository.save(s);
            }
        });

        List<Supplier> allSuppliers = supplierRepository.findAll();

        // Crear clientes
        List<String> firstNames = List.of(
                "Carlos", "María", "Javier", "Lucía", "Andrés", "Valentina", "Santiago", "Camila",
                "Diego", "Paula", "Ricardo", "Sofía", "Matías", "Daniela", "Alejandro", "Florencia",
                "Martín", "Julieta", "Tomás", "Natalia"
        );

        List<String> lastNames = List.of(
                "García", "López", "Fernández", "Martínez", "Torres", "Pérez", "Morales", "Herrera",
                "Castillo", "Gómez", "Díaz", "Romero", "Rojas", "Vargas", "Cruz", "Navarro",
                "Ibáñez", "Cabrera", "Molina", "Suárez"
        );

        List<Customer> customers = new ArrayList<>();

        for (int i = 1; i <= 15; i++) {
            Customer c = new Customer();

            String firstName = firstNames.get(random.nextInt(firstNames.size()));
            String lastName = lastNames.get(random.nextInt(lastNames.size()));

            c.setFirstName(firstName);
            c.setLastName(lastName);
            c.setEmail((firstName + "." + lastName + i + "@mail.com").toLowerCase());
            c.setPhone("+54911" + (1000000 + random.nextInt(8999999)));
            c.setDni("55" + (33000 + i));
            c.setPassport("AA" + (200000 + i));
            c.setAgency(agency);

            customers.add(customerRepository.save(c));
        }


        // Crear ventas
        for (int i = 1; i <= 20; i++) {
            Customer customer = customers.get(random.nextInt(customers.size()));
            TravelSale sale = new TravelSale();

            LocalDate creationDate = LocalDate.now().minusDays(random.nextInt(180));
            sale.setCreationDate(creationDate);
            sale.setTravelDate(creationDate.plusDays(15L + random.nextInt(60)));
            sale.setCustomer(customer);
            sale.setAgency(agency);
            sale.setUser(admin);

            List<String> currencies = List.of("USD", "EUR");
            sale.setCurrency(currencies.get(random.nextInt(currencies.size())));

            sale.setDescription("Venta #" + i + " para " + customer.getFirstName());

            BigDecimal totalServicesAmount = BigDecimal.ZERO;

            // Determinar tipo de venta
            int tipoVenta = random.nextInt(3); // 0 = solo aéreo, 1 = aéreo+hotel+traslado, 2 = completo

            List<Booking> bookings = new ArrayList<>();

            // --- Aéreo ---
            Supplier aerial = getRandomSupplier(allSuppliers, List.of("CDV", "Aertickets", "Starling"));
            double flightAmount = 400.0 + random.nextInt(600);
            bookings.add(createBooking(aerial, sale, "Vuelo #" + i, flightAmount, aerial.getCurrency(), random.nextBoolean(), admin));
            totalServicesAmount = totalServicesAmount.add(convertTo(flightAmount, aerial.getCurrency(), sale.getCurrency()));

            if (tipoVenta >= 1) {
                // --- Hotel ---
                Supplier hotel = getRandomSupplier(allSuppliers, List.of("Mitika", "Welcomebeds", "WorldToMeet"));
                double hotelAmount = 300.0 + random.nextInt(500);
                bookings.add(createBooking(hotel, sale, "Hotel #" + i, hotelAmount, hotel.getCurrency(), random.nextBoolean(), admin));
                totalServicesAmount = totalServicesAmount.add(convertTo(hotelAmount, hotel.getCurrency(), sale.getCurrency()));

                // --- Traslado ---
                Supplier transfer = getRandomSupplier(allSuppliers, List.of("Mitika", "MyTransfers"));
                double transferAmount = 80.0 + random.nextInt(50);
                bookings.add(createBooking(transfer, sale, "Traslado #" + i, transferAmount, transfer.getCurrency(), random.nextBoolean(), admin));
                totalServicesAmount = totalServicesAmount.add(convertTo(transferAmount, transfer.getCurrency(), sale.getCurrency()));
            }

            if (tipoVenta == 2) {
                // --- Tour ---
                Supplier tour = getRandomSupplier(allSuppliers, List.of("Civitatis"));
                double tourAmount = 120.0 + random.nextInt(80);
                bookings.add(createBooking(tour, sale, "Tour #" + i, tourAmount, tour.getCurrency(), random.nextBoolean(), admin));
                totalServicesAmount = totalServicesAmount.add(convertTo(tourAmount, tour.getCurrency(), sale.getCurrency()));
            }

            // Genera margen entre 0.10 y 0.20
            double randomMargin = 0.10 + (random.nextDouble() * 0.10);

            BigDecimal multiplier = BigDecimal.valueOf(1 + randomMargin);
            BigDecimal saleTotal = totalServicesAmount.multiply(multiplier);

            sale.setAmount(saleTotal.setScale(2, RoundingMode.HALF_UP));

            travelSaleRepository.save(sale);

            for (Booking b : bookings) {
                b.setSale(sale);
                bookingRepository.save(b);
            }
        }

        logger.info("✅ Carga de datos completada: 15 clientes, 20 ventas.");
    }

    private Supplier getRandomSupplier(List<Supplier> suppliers, List<String> names) {
        List<Supplier> filtered = suppliers.stream()
                .filter(s -> names.contains(s.getSupplierName()))
                .toList();
        return filtered.get(random.nextInt(filtered.size()));
    }

    private Booking createBooking(Supplier supplier, TravelSale sale, String desc, double amount, String currency, boolean paid, User user) {
        Booking b = new Booking();
        b.setSupplier(supplier);
        b.setDescription(desc);
        b.setBookingNumber("BK" + (1000 + random.nextInt(9000)));
        b.setReservationDate(LocalDate.now().minusDays(random.nextInt(90)));
        b.setAmount(BigDecimal.valueOf(amount));
        b.setCurrency(currency);
        b.setPaid(paid);
        b.setActive(true);
        b.setAgency(sale.getAgency());
        b.setSale(sale);
        b.setCreatedBy(user);
        b.setBookingDate(LocalDate.now().minusDays(random.nextInt(120)));

        // 🔹 Conversión de moneda a la moneda de la venta
        BigDecimal amountInSaleCurrency = convertTo(amount, currency, sale.getCurrency());
        b.setAmountInSaleCurrency(amountInSaleCurrency);

        // 🔹 Tasa de conversión usada (según el sentido)
        BigDecimal exchangeRate = BigDecimal.ONE;
        if (!currency.equals(sale.getCurrency())) {
            if (currency.equals("USD") && sale.getCurrency().equals("EUR")) {
                exchangeRate = usdToEuroRate;
            } else if (currency.equals("EUR") && sale.getCurrency().equals("USD")) {
                exchangeRate = euroToUsdRate;
            }
        }
        b.setExchangeRate(exchangeRate);

        return b;
    }

    private BigDecimal convertTo(Double bookingAmount, String bookingCurrency, String saleCurrency) {

        if (bookingAmount == null) {
            return BigDecimal.ZERO;
        }

        BigDecimal amount = BigDecimal.valueOf(bookingAmount);

        if (bookingCurrency.equalsIgnoreCase(saleCurrency)) {
            return amount;
        } else if (bookingCurrency.equalsIgnoreCase("EUR") && saleCurrency.equalsIgnoreCase("USD")) {
            return amount.multiply(euroToUsdRate);
        } else if (bookingCurrency.equalsIgnoreCase("USD") && saleCurrency.equalsIgnoreCase("EUR")) {
            return amount.multiply(usdToEuroRate);
        }

        return amount; // fallback por si hay otra moneda
    }
}
