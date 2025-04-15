package com.crishof.travelagent.service;

import com.crishof.travelagent.dto.ClientRequest;
import com.crishof.travelagent.dto.ClientResponse;

import java.util.List;

public interface ClientService {

    List<ClientResponse> getAll();

    ClientResponse getById(long id);

    ClientResponse create(ClientRequest clientRequest);

    ClientResponse update(long id, ClientRequest clientRequest);

    String delete(long id);
}
