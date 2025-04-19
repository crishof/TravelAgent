# TravelAgent

**TravelAgent** is a backend application for managing travel package sales in a travel agency.  
It is **not** a billing or invoicing system, but rather a tool to organize and track sales activity, service bookings, agents, and internal commissions.

---

## ✈️ Purpose

This application helps travel agencies keep track of:

- Travel packages sold to clients
- The individual services included in each package (e.g. hotels, flights, tours)
- The agent responsible for the sale
- Internal commission tracking
- Whether services have been paid to suppliers
- Whether sales have been collected from customers

---

## 🧩 Features

- CRUD operations for:
  - Travel Sales
  - Bookings (services)
  - Agents
  - Suppliers
- Association of services to each travel sale
- Track payment status for each booking
- Track collection status for each travel sale
- Calculation-ready structure for internal commissions

---

## 📦 Technologies

- Java 21
- Spring Boot 3
- Spring Data JPA (Hibernate)
- PostgreSQL
- Lombok
- Maven

---

## 🚧 Not included (by design)

- Client-facing interfaces
- Automatic invoice generation or fiscal reporting
- Online payment gateways

---

## 🗂️ Project structure

root/
├── backend/       # Java Spring Boot API
├── frontend/      #  Angular app
├── .gitignore
└── README.md