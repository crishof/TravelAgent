package com.crishof.travelagent.mapper;

import com.crishof.travelagent.dto.PaymentRequest;
import com.crishof.travelagent.dto.PaymentResponse;
import com.crishof.travelagent.model.Payment;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface PaymentMapper {

    PaymentResponse toDto(Payment payment);

    Payment toEntity(PaymentRequest paymentRequest);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromRequest(PaymentRequest paymentRequest, @MappingTarget Payment payment);
}
