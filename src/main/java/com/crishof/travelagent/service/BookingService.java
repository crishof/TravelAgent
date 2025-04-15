package com.crishof.travelagent.service;

import com.crishof.travelagent.dto.AgentResponse;
import com.crishof.travelagent.dto.BookingRequest;
import com.crishof.travelagent.dto.BookingResponse;

import java.util.List;

public interface BookingService {

    List<AgentResponse> getAll();

    BookingResponse getbyId(long id);

    BookingResponse create(BookingRequest bookingRequest);

    BookingResponse update(long id, BookingRequest bookingRequest);

    String delete(long id);

}
