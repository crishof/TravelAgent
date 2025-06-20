package com.crishof.travelagent.mapper;

import com.crishof.travelagent.dto.CustomerPaymentRequest;
import com.crishof.travelagent.dto.CustomerPaymentResponse;
import com.crishof.travelagent.model.CustomerPayment;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface CustomerPaymentMapper {

    CustomerPaymentResponse toDto(CustomerPayment customerPayment);

    CustomerPayment toEntity(CustomerPaymentRequest customerPaymentRequest);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromRequest(CustomerPaymentRequest customerPaymentRequest, @MappingTarget CustomerPayment customerPayment);
}