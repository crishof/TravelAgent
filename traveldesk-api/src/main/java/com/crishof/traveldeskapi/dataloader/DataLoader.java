package com.crishof.traveldeskapi.dataloader;

import com.crishof.traveldeskapi.model.Agency;
import com.crishof.traveldeskapi.model.Booking;
import com.crishof.traveldeskapi.model.BookingStatus;
import com.crishof.traveldeskapi.model.Customer;
import com.crishof.traveldeskapi.model.Role;
import com.crishof.traveldeskapi.model.Sale;
import com.crishof.traveldeskapi.model.SaleStatus;
import com.crishof.traveldeskapi.model.Supplier;
import com.crishof.traveldeskapi.model.SupplierType;
import com.crishof.traveldeskapi.model.User;
import com.crishof.traveldeskapi.model.UserStatus;
import com.crishof.traveldeskapi.repository.AgencyRepository;
import com.crishof.traveldeskapi.repository.BookingRepository;
import com.crishof.traveldeskapi.repository.CustomerRepository;
import com.crishof.traveldeskapi.repository.SaleRepository;
import com.crishof.traveldeskapi.repository.SupplierRepository;
import com.crishof.traveldeskapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.Normalizer;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
@Profile("dev")
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataLoader.class);

    private final UserRepository userRepository;
    private final AgencyRepository agencyRepository;
    private final SupplierRepository supplierRepository;
    private final CustomerRepository customerRepository;
    private final SaleRepository saleRepository;
    private final BookingRepository bookingRepository;
    private final PasswordEncoder passwordEncoder;

    private final Random random = new Random();

    @Override
    public void run(String... args) {
        logger.info("🚀 DataLoader iniciado (dev)");

        Agency agency = agencyRepository.findByNormalizedName("beat-travel")
                .orElseGet(() -> {
                    Agency a = new Agency();
                    a.setName("Beat Travel");
                    a.setNormalizedName("beat-travel");
                    a.setCurrency("USD");
                    a.setTimeZone("America/Argentina/Buenos_Aires");
                    return agencyRepository.save(a);
                });

        User admin = userRepository.findByEmail("admin@beattravel.dev")
                .orElseGet(() -> {
                    User u = new User();
                    u.setFullName("Cristian Hoffmann");
                    u.setEmail("admin@beattravel.dev");
                    u.setPasswordHash(passwordEncoder.encode("change-me-dev"));
                    u.setAgency(agency);
                    u.setRole(Role.ADMIN);
                    u.setStatus(UserStatus.ACTIVE);
                    return userRepository.save(u);
                });

        User agentOne = userRepository.findByEmail("agent1@beattravel.dev")
                .orElseGet(() -> {
                    User u = new User();
                    u.setFullName("Lucia Gomez");
                    u.setEmail("agent1@beattravel.dev");
                    u.setPasswordHash(passwordEncoder.encode("change-me-dev"));
                    u.setAgency(agency);
                    u.setRole(Role.AGENT);
                    u.setStatus(UserStatus.ACTIVE);
                    return userRepository.save(u);
                });

        User agentTwo = userRepository.findByEmail("agent2@beattravel.dev")
                .orElseGet(() -> {
                    User u = new User();
                    u.setFullName("Matias Perez");
                    u.setEmail("agent2@beattravel.dev");
                    u.setPasswordHash(passwordEncoder.encode("change-me-dev"));
                    u.setAgency(agency);
                    u.setRole(Role.AGENT);
                    u.setStatus(UserStatus.ACTIVE);
                    return userRepository.save(u);
                });

        List<User> salesUsers = List.of(admin, agentOne, agentTwo);

        if (supplierRepository.countByAgencyId(agency.getId()) == 0) {
            supplierRepository.saveAll(buildSuppliers(agency));
            logger.info("✅ Proveedores creados");
        }

        List<Supplier> allSuppliers = supplierRepository.findAllByAgencyIdOrderByNameAsc(agency.getId());

        List<Customer> customers;
        if (customerRepository.countByAgencyId(agency.getId()) == 0) {
            customers = customerRepository.saveAll(buildCustomers(agency));
            logger.info("✅ Clientes creados");
        } else {
            customers = customerRepository.findAllByAgencyIdOrderByFullNameAsc(agency.getId());
        }

        if (saleRepository.count() > 0 || bookingRepository.count() > 0) {
            logger.info("ℹ️ Ya existen ventas o reservas. Se omite la carga de demo para evitar duplicados.");
            return;
        }

        List<String> destinations = List.of(
                "Madrid", "Barcelona", "Roma", "Paris", "Londres",
                "Miami", "Nueva York", "Cancun", "Punta Cana", "Rio de Janeiro"
        );

        for (int i = 1; i <= 20; i++) {
            Customer customer = customers.get(random.nextInt(customers.size()));
            User createdBy = salesUsers.get(random.nextInt(salesUsers.size()));
            Supplier supplier = allSuppliers.get(random.nextInt(allSuppliers.size()));
            String destination = destinations.get(random.nextInt(destinations.size()));

            Instant saleDate = randomPastInstant(180);
            Instant departureDate = saleDate.plusSeconds((15L + random.nextInt(60)) * 24 * 60 * 60);

            BigDecimal netAmount = BigDecimal.valueOf(400L + random.nextInt(1600));
            BigDecimal marginMultiplier = BigDecimal.valueOf(1.10 + (random.nextDouble() * 0.15));
            BigDecimal finalAmount = netAmount.multiply(marginMultiplier).setScale(2, RoundingMode.HALF_UP);

            Sale sale = new Sale();
            sale.setAgency(agency);
            sale.setCustomer(customer);
            sale.setSupplier(supplier);
            sale.setCreatedBy(createdBy);
            sale.setDestination(destination);
            sale.setAmount(finalAmount);
            sale.setCurrency(agency.getCurrency());
            sale.setStatus(randomSaleStatus());
            sale.setSaleDate(saleDate);
            sale.setDepartureDate(departureDate);
            sale.setDescription("Venta demo #" + i + " para " + customer.getFullName());

            saleRepository.save(sale);

            Booking booking = new Booking();
            booking.setAgency(agency);
            booking.setCustomer(customer);
            booking.setSupplier(supplier);
            booking.setCreatedBy(createdBy);
            booking.setReference(generateReference(i));
            booking.setPassengerName(customer.getFullName());
            booking.setDestination(destination);
            booking.setDepartureDate(toLocalDate(departureDate));
            booking.setReturnDate(toLocalDate(departureDate.plusSeconds((3L + random.nextInt(10)) * 24 * 60 * 60)));
            booking.setStatus(randomBookingStatus(sale.getStatus()));

            bookingRepository.save(booking);
        }

        logger.info("✅ Carga de datos completada: agencia, usuarios, proveedores, clientes, ventas y reservas demo.");
    }

    private List<Supplier> buildSuppliers(Agency agency) {
        List<Supplier> suppliers = new ArrayList<>();
        suppliers.add(buildSupplier(agency, "CDV", "cdv@suppliers.dev", "+54 11 4000-0001", SupplierType.AIRLINE));
        suppliers.add(buildSupplier(agency, "Aertickets", "aertickets@suppliers.dev", "+54 11 4000-0002", SupplierType.AIRLINE));
        suppliers.add(buildSupplier(agency, "Starling", "starling@suppliers.dev", "+54 11 4000-0003", SupplierType.AIRLINE));
        suppliers.add(buildSupplier(agency, "Mitika", "mitika@suppliers.dev", "+54 11 4000-0004", SupplierType.OPERATOR));
        suppliers.add(buildSupplier(agency, "MyTransfers", "mytransfers@suppliers.dev", "+54 11 4000-0005", SupplierType.TRANSPORT));
        suppliers.add(buildSupplier(agency, "Civitatis", "civitatis@suppliers.dev", "+54 11 4000-0006", SupplierType.OPERATOR));
        suppliers.add(buildSupplier(agency, "WelcomeBeds", "welcomebeds@suppliers.dev", "+54 11 4000-0007", SupplierType.HOTEL));
        suppliers.add(buildSupplier(agency, "WorldToMeet", "worldtomeet@suppliers.dev", "+54 11 4000-0008", SupplierType.OPERATOR));
        return suppliers;
    }

    private Supplier buildSupplier(Agency agency, String name, String email, String phone, SupplierType type) {
        Supplier supplier = new Supplier();
        supplier.setAgency(agency);
        supplier.setName(name);
        supplier.setEmail(email);
        supplier.setPhone(phone);
        supplier.setType(type);
        return supplier;
    }

    private List<Customer> buildCustomers(Agency agency) {
        List<String> firstNames = List.of(
                "Carlos", "Maria", "Javier", "Lucia", "Andres", "Valentina", "Santiago", "Camila",
                "Diego", "Paula", "Ricardo", "Sofia", "Matias", "Daniela", "Alejandro", "Florencia",
                "Martin", "Julieta", "Tomas", "Natalia"
        );

        List<String> lastNames = List.of(
                "Garcia", "Lopez", "Fernandez", "Martinez", "Torres", "Perez", "Morales", "Herrera",
                "Castillo", "Gomez", "Diaz", "Romero", "Rojas", "Vargas", "Cruz", "Navarro",
                "Ibanez", "Cabrera", "Molina", "Suarez"
        );

        List<Customer> customers = new ArrayList<>();

        for (int i = 1; i <= 15; i++) {
            String firstName = firstNames.get(random.nextInt(firstNames.size()));
            String lastName = lastNames.get(random.nextInt(lastNames.size()));

            Customer customer = new Customer();
            customer.setAgency(agency);
            customer.setFullName(firstName + " " + lastName);
            customer.setEmail((normalizeForEmail(firstName) + "." + normalizeForEmail(lastName) + i + "@mail.com").toLowerCase());
            customer.setPhone("+54911" + (1000000 + random.nextInt(8999999)));
            customer.setPassportNumber("AA" + (200000 + i));

            customers.add(customer);
        }

        return customers;
    }

    private String normalizeForEmail(String value) {
        String normalized = Normalizer.normalize(value, Normalizer.Form.NFD);
        return normalized.replaceAll("\\p{M}", "");
    }

    private Instant randomPastInstant(int maxDaysBack) {
        return Instant.now().minusSeconds((long) random.nextInt(maxDaysBack) * 24 * 60 * 60);
    }

    private String generateReference(int index) {
        return "RSV-" + String.format("%04d", index) + "-" + (1000 + random.nextInt(9000));
    }

    private LocalDate toLocalDate(Instant instant) {
        return instant.atZone(ZoneOffset.UTC).toLocalDate();
    }

    private SaleStatus randomSaleStatus() {
        int value = random.nextInt(100);
        if (value < 70) {
            return SaleStatus.CONFIRMED;
        }
        if (value < 90) {
            return SaleStatus.CREATED;
        }
        return SaleStatus.CANCELLED;
    }

    private BookingStatus randomBookingStatus(SaleStatus saleStatus) {
        return switch (saleStatus) {
            case CONFIRMED -> BookingStatus.CONFIRMED;
            case CANCELLED -> BookingStatus.CANCELLED;
            case CREATED -> BookingStatus.PENDING;
        };
    }
}
