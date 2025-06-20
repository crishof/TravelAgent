package com.crishof.travelagent.mapper;

import com.crishof.travelagent.dto.UserResponse;
import com.crishof.travelagent.model.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponse toDto(User user);
}