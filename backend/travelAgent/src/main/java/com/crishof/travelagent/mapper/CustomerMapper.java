package com.crishof.travelagent.mapper;

import com.crishof.travelagent.dto.CustomerRequest;
import com.crishof.travelagent.dto.CustomerResponse;
import com.crishof.travelagent.model.Customer;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface CustomerMapper {

    CustomerResponse toDto(Customer customer);

    Customer toEntity(CustomerRequest customerRequest);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntity(CustomerRequest customerRequest, @MappingTarget Customer customer);
}
