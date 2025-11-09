package com.crishof.travelagent.repository;

import com.crishof.travelagent.dto.TopSupplierDTO;
import com.crishof.travelagent.model.Agency;
import com.crishof.travelagent.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findAllByBookingNumber(String bookingNumber);

    boolean existsBySupplierId(Long supplierId);

    List<Booking> findAllByAgency(Agency agency);

    @Query("""
            SELECT new com.crishof.travelagent.dto.TopSupplierDTO(
                b.supplier.supplierName,
                COUNT(b.id),
                COALESCE(SUM(b.amountInSaleCurrency), 0)
            )
            FROM Booking b
            WHERE b.active = true
            GROUP BY b.supplier.supplierName
            ORDER BY SUM(b.amountInSaleCurrency) DESC
            """)
    List<TopSupplierDTO> findTopSuppliers();
}
