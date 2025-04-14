package com.crishof.travelagent.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;


@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class Client {

    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String lastname;
    private String phone;
    private String email;
    private String dni;

    @OneToMany
    private ArrayList<Image> dniImages;
}
