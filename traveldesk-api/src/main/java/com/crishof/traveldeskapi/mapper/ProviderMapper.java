package com.crishof.traveldeskapi.mapper;

import com.crishof.traveldeskapi.dto.ProviderRequest;
import com.crishof.traveldeskapi.dto.ProviderResponse;
import com.crishof.traveldeskapi.model.Provider;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ProviderMapper {

    @Mapping(target = "serviceType", source = "type")
    ProviderResponse toResponse(Provider provider);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "agency", ignore = true)
    @Mapping(target = "type", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Provider toEntity(ProviderRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "agency", ignore = true)
    @Mapping(target = "type", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromRequest(ProviderRequest request, @MappingTarget Provider provider);

    default String map(com.crishof.traveldeskapi.model.ProviderType providerType) {
        return providerType == null ? null : providerType.name();
    }
}
