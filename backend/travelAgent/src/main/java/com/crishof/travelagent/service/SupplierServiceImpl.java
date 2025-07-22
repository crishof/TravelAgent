package com.crishof.travelagent.service;

import com.crishof.travelagent.dto.SupplierRequest;
import com.crishof.travelagent.exception.SupplierNotFoundException;
import com.crishof.travelagent.mapper.SupplierMapper;
import com.crishof.travelagent.model.Agency;
import com.crishof.travelagent.model.Supplier;
import com.crishof.travelagent.repository.BookingRepository;
import com.crishof.travelagent.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SupplierServiceImpl implements SupplierService {

    private final SupplierRepository supplierRepository;
    private final UserService userService;
    private final BookingRepository bookingRepository;
    private final SupplierMapper supplierMapper;

    @Override
    public List<Supplier> getAll() {
        Agency agency = userService.getCurrentUser().getAgency();
        return supplierRepository.findAllByAgency(agency).stream()
                .sorted(Comparator.comparing(Supplier::getSupplierName))
                .toList();

    }

    @Override
    public Supplier getById(Long id) {
        return supplierRepository.findById(id).orElseThrow(() -> new SupplierNotFoundException(id));
    }

    @Override
    public Supplier create(SupplierRequest supplierRequest) {

        Supplier supplier = supplierMapper.toEntity(supplierRequest);
        supplier.setAgency(userService.getCurrentUser().getAgency());

        return supplierRepository.save(supplier);
    }

    @Override
    public Supplier update(Long id, SupplierRequest supplierRequest) {

        Supplier supplier = supplierRepository.findById(id).orElseThrow(() -> new SupplierNotFoundException(id));
        supplierMapper.updateEntityFromRequest(supplierRequest, supplier);

        return supplierRepository.save(supplier);
    }

    @Override
    public String delete(Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new SupplierNotFoundException(id));

        if (bookingRepository.existsBySupplierId(supplier.getId())) {
            throw new IllegalStateException("Cannot delete supplier with existing bookings.");
        }

        supplierRepository.delete(supplier);
        return "Supplier with id " + id + " deleted";
    }
}
