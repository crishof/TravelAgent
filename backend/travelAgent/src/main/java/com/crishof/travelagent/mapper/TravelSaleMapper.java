package com.crishof.travelagent.mapper;

import com.crishof.travelagent.dto.TravelSaleRequest;
import com.crishof.travelagent.dto.TravelSaleResponse;
import com.crishof.travelagent.model.TravelSale;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {BookingMapper.class, CustomerMapper.class})
public interface TravelSaleMapper {

    // Mapping inverso usado en persistencia
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "agency", ignore = true)
    @Mapping(target = "services", ignore = true)
    @Mapping(target = "creationDate", ignore = true)
    TravelSale toEntity(TravelSaleRequest request);

    // Mapping para DTO
    @Mapping(source = "customer", target = "customerResponse")
    @Mapping(source = "services", target = "services")
    @Mapping(source = "user", target = "userResponse")
    TravelSaleResponse toDto(TravelSale sale);
}