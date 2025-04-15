package com.crishof.travelagent.service;

import com.crishof.travelagent.dto.AgentResponse;
import com.crishof.travelagent.dto.BookingRequest;
import com.crishof.travelagent.dto.BookingResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {
    @Override
    public List<AgentResponse> getAll() {
        return List.of();
    }

    @Override
    public BookingResponse getbyId(long id) {
        return null;
    }

    @Override
    public BookingResponse create(BookingRequest bookingRequest) {
        return null;
    }

    @Override
    public BookingResponse update(long id, BookingRequest bookingRequest) {
        return null;
    }

    @Override
    public String delete(long id) {
        return null;
    }
}
