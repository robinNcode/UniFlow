# UniFlow

> **A scalable, event-driven University Admission Platform built with ASP.NET Core, React, PostgreSQL, Redis, and RabbitMQ.**

UniFlow is a modern software engineering project designed to simulate a **national-scale university admission platform** capable of handling large volumes of applicants, concurrent seat allocation, asynchronous processing, and real-time system updates.

Unlike traditional university management systems, UniFlow focuses on the engineering challenges behind high-traffic admission systems, including distributed architecture, event-driven communication, concurrency control, caching, background processing, and scalable service design.

The project is intended as a portfolio demonstrating production-oriented backend and full-stack development practices rather than a simple CRUD application.

---

## Objectives

* Build a production-style ASP.NET Core application.
* Learn and apply Event-Driven Architecture using RabbitMQ.
* Implement distributed caching and locking with Redis.
* Design scalable APIs following Clean Architecture principles.
* Practice asynchronous processing with background workers.
* Build a modern React frontend.
* Demonstrate software architecture suitable for enterprise-scale systems.

---

## Key Features

* Student registration and authentication
* Online admission application
* Document upload and verification workflow
* Online payment processing (mock gateway)
* Automated merit list generation
* Intelligent seat allocation
* Waiting list management
* Real-time admission status updates
* SMS, email, and in-app notification pipeline
* Administrative dashboard
* Audit logging and activity tracking

---

## Proposed Architecture

```text
                    React Frontend
                           │
                           ▼
                     ASP.NET Core APIs
                           │
      ┌────────────────────┼────────────────────┐
      │                    │                    │
 Admission Service   Payment Service   Notification Service
      │                    │                    │
      └────────────── RabbitMQ ────────────────┘
                           │
                    Merit Service
                           │
                    Audit Service

       PostgreSQL • Redis • Docker • SignalR
```

---

## Technology Stack

### Backend

* ASP.NET Core
* Entity Framework Core
* PostgreSQL
* RabbitMQ
* Redis
* FluentValidation
* AutoMapper
* JWT Authentication
* SignalR
* Serilog

### Frontend

* React
* TypeScript
* React Query
* React Hook Form
* Tailwind CSS

### Infrastructure

* Docker
* Docker Compose
* GitHub Actions (planned)

---

## Engineering Concepts

This project is intended to demonstrate practical experience with:

* Clean Architecture
* Repository Pattern
* Dependency Injection
* Event-Driven Architecture
* Asynchronous Messaging
* Background Workers
* Distributed Transactions
* Caching Strategies
* Distributed Locking
* API Design
* Authentication & Authorization
* Structured Logging
* Health Checks
* RESTful API Design
* Containerization

---

## Development Roadmap

### Phase 1

* ASP.NET Core Monolith
* PostgreSQL
* JWT Authentication
* CRUD APIs
* Clean Architecture

### Phase 2

* RabbitMQ Integration
* Background Workers
* Event Publishing
* Notification Pipeline

### Phase 3

* Redis Integration
* Caching
* OTP Storage
* Distributed Locking
* Rate Limiting

### Phase 4

* Service Decomposition
* Admission Service
* Payment Service
* Merit Service
* Notification Service
* Audit Service

### Phase 5

* React Frontend
* SignalR
* Real-time Dashboard
* Docker Compose
* CI/CD
* Integration Testing

---

## Project Status

🚧 **Currently under active development**

The project is being built incrementally, beginning with a modular monolith and gradually evolving into an event-driven microservice architecture to reflect how many real-world enterprise systems mature over time.

---

## Learning Goals

This project is designed to strengthen practical knowledge in:

* ASP.NET Core
* PostgreSQL
* Entity Framework Core
* RabbitMQ
* Redis
* React
* Docker
* Event-Driven Systems
* Distributed System Design
* Enterprise Application Architecture
* Scalable Backend Development

---

## License

This project is released under the MIT License.
