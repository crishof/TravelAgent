package com.crishof.travelagent.mapper;

import com.crishof.travelagent.dto.SupplierRequest;
import com.crishof.travelagent.dto.SupplierResponse;
import com.crishof.travelagent.model.Supplier;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface SupplierMapper {

    SupplierResponse toDto(Supplier supplier);

    Supplier toEntity(SupplierRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromRequest(SupplierRequest supplierRequest, @MappingTarget Supplier supplier);
}