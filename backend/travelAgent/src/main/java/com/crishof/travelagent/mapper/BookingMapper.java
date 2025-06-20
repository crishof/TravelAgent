package com.crishof.travelagent.mapper;

import com.crishof.travelagent.dto.BookingRequest;
import com.crishof.travelagent.dto.BookingResponse;
import com.crishof.travelagent.model.Booking;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface BookingMapper {

    @Mapping(source = "supplier.supplierName", target = "supplierName")
    @Mapping(source = "sale.id", target = "saleId")
    BookingResponse toDto(Booking booking);

    // Mapea lo posible, ignora supplier que se setea manualmente en el service
    @Mapping(target = "supplier", ignore = true)
    Booking toEntity(BookingRequest bookingRequest);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromRequest(BookingRequest bookingRequest, @MappingTarget Booking booking);
}