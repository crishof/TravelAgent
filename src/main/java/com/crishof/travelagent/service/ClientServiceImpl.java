package com.crishof.travelagent.service;

import com.crishof.travelagent.dto.ClientRequest;
import com.crishof.travelagent.dto.ClientResponse;
import com.crishof.travelagent.exception.ClientNotFoundException;
import com.crishof.travelagent.model.Client;
import com.crishof.travelagent.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {

    private final ClientRepository clientRepository;

    @Override
    public List<ClientResponse> getAll() {
        List<Client> clients = clientRepository.findAll();
        return clients.stream()
                .map(this::toClientResponse)
                .toList();
    }

    @Override
    public ClientResponse getById(long id) {

        Client client = clientRepository.findById(id).orElseThrow(() -> new ClientNotFoundException(id));
        return this.toClientResponse(client);
    }

    @Override
    public ClientResponse create(ClientRequest clientRequest) {

        return this.toClientResponse(clientRepository.save(this.toClient(clientRequest)));
    }

    @Override
    public ClientResponse update(long id, ClientRequest clientRequest) {

        Client client = clientRepository.findById(id).orElseThrow(() -> new ClientNotFoundException(id));

        client.setName(clientRequest.getName());
        client.setLastname(clientRequest.getLastname());
        client.setEmail(clientRequest.getEmail());
        client.setDni(clientRequest.getDni());
        client.setPassport(clientRequest.getPassport());
        client.setPhone(clientRequest.getPhone());
        return this.toClientResponse(clientRepository.save(client));
    }

    @Override
    public String delete(long id) {
        Client client = clientRepository.findById(id).orElseThrow(() -> new ClientNotFoundException(id));
        clientRepository.delete(client);
        return "Client with id " + id + " deleted";
    }

    private ClientResponse toClientResponse(Client client) {
        ClientResponse clientResponse = new ClientResponse();

        clientResponse.setId(client.getId());
        clientResponse.setName(client.getName());
        clientResponse.setLastname(client.getLastname());
        clientResponse.setPhone(client.getPhone());
        clientResponse.setDni(client.getDni());
        clientResponse.setPassport(client.getPassport());
        clientResponse.setEmail(client.getEmail());
        return clientResponse;
    }

    private Client toClient(ClientRequest clientRequest) {
        Client client = new Client();
        client.setName(clientRequest.getName());
        client.setLastname(clientRequest.getLastname());
        client.setEmail(clientRequest.getEmail());
        client.setDni(clientRequest.getDni());
        client.setPassport(clientRequest.getPassport());
        client.setPhone(clientRequest.getPhone());
        return client;
    }
}
