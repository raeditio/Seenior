import type { AnalyzeResponse } from "./types";

export const MOCK_RESPONSE: AnalyzeResponse = {
  documentation: {
    summary:
      "Spring PetClinic is a sample web application demonstrating Spring Boot capabilities. It allows veterinary clinic staff to manage pet owners, their pets, and veterinarian visits. The app is used as a reference implementation by the Spring team to showcase best practices for building production-ready Spring applications.",
    filesToReadFirst: [
      {
        path: "src/main/java/org/springframework/samples/petclinic/PetClinicApplication.java",
        reason: "Entry point — shows how the app bootstraps and which Spring profiles are active.",
      },
      {
        path: "src/main/java/org/springframework/samples/petclinic/owner/OwnerController.java",
        reason: "The primary controller — covers the most-trafficked user flows (owner search, add, edit).",
      },
      {
        path: "src/main/java/org/springframework/samples/petclinic/owner/OwnerRepository.java",
        reason: "Shows the data access pattern — Spring Data JPA with custom JPQL queries.",
      },
      {
        path: "src/main/resources/application.properties",
        reason: "All environment configuration in one place, including active datasource profile.",
      },
      {
        path: "src/main/resources/db/hsqldb/schema.sql",
        reason: "The canonical data model — faster to read than reverse-engineering from JPA entities.",
      },
    ],
    businessLogic: [
      {
        name: "Owner Management",
        businessRules: "Owners can have multiple pets. Search is by last name prefix, not exact match.",
        nonObviousDecisions: "The owner list is paginated server-side at 5 per page — this is hardcoded, not configurable.",
      },
      {
        name: "Pet & Visit Tracking",
        businessRules: "Each pet has a type (dog, cat, etc.) and belongs to exactly one owner. Visits are append-only — no editing or deletion.",
        nonObviousDecisions: "Pet type is loaded from a cached lookup table on startup, not fetched per-request.",
      },
      {
        name: "Veterinarian Directory",
        businessRules: "Vets are read-only from the UI — managed via DB seed data only.",
        nonObviousDecisions: "Vet list is cached in memory for the duration of the app session via @Cacheable.",
      },
    ],
    techStack: ["Spring Boot 3.2", "Spring MVC", "Spring Data JPA", "Thymeleaf", "HSQLDB (dev)", "MySQL (prod)", "Bootstrap 5"],
    gotchas: [
      "Two datasource profiles exist (hsqldb and mysql) — the default is hsqldb in-memory, which resets on every restart.",
      "The @Cacheable on the vet list means vet data changes in the DB won't appear until the app restarts.",
      "Form validation uses JSR-303 annotations on the model, not controller-level validation — errors surface differently than in typical Spring controllers.",
    ],
  },
  diagrams: {
    architectureChart: `flowchart TD
  Browser["Browser"]
  OC["OwnerController"]
  PC["PetController"]
  VC["VisitController"]
  VetC["VetController"]
  OR["OwnerRepository"]
  PR["PetRepository"]
  VR["VisitRepository"]
  VetR["VetRepository"]
  DB[("Database")]
  Cache["In-Memory Cache"]

  Browser -->|HTTP GET/POST| OC
  Browser -->|HTTP GET/POST| PC
  Browser -->|HTTP GET/POST| VC
  Browser -->|HTTP GET| VetC
  OC -->|queries| OR
  PC -->|queries| PR
  VC -->|queries| VR
  VetC -->|reads| Cache
  Cache -->|populated from| VetR
  OR --> DB
  PR --> DB
  VR --> DB
  VetR --> DB`,
    requestFlow: `sequenceDiagram
  actor User
  participant Browser
  participant OwnerController
  participant OwnerRepository
  participant DB as Database

  User->>Browser: Search owners by last name
  Browser->>OwnerController: GET /owners?lastName=Davis
  OwnerController->>OwnerRepository: findByLastName("Davis")
  OwnerRepository->>DB: SELECT * FROM owners WHERE last_name LIKE 'Davis%'
  DB-->>OwnerRepository: [Owner rows]
  OwnerRepository-->>OwnerController: List<Owner>
  OwnerController-->>Browser: Render owners/ownersList.html
  Browser-->>User: Display paginated owner list`,
  },
  quiz: {
    questions: [
      {
        question: "What is the default datasource profile when running Spring PetClinic locally?",
        type: "multiple_choice",
        options: ["MySQL", "PostgreSQL", "HSQLDB (in-memory)", "H2"],
        answer: "HSQLDB (in-memory)",
      },
      {
        question: "Why does the vet list not update immediately when you change vet data directly in the database?",
        type: "short_answer",
        answer: "The vet list is cached in memory using @Cacheable and only refreshes when the application restarts.",
      },
      {
        question: "Which component is responsible for searching owners by last name?",
        type: "multiple_choice",
        options: ["VetController", "PetController", "OwnerRepository", "OwnerController"],
        answer: "OwnerController",
      },
      {
        question: "How many pets can a single owner have in this system?",
        type: "short_answer",
        answer: "Multiple pets — the Owner entity has a one-to-many relationship with Pet.",
      },
      {
        question: "Where is the production database schema defined?",
        type: "multiple_choice",
        options: [
          "In the JPA entity annotations only",
          "src/main/resources/db/mysql/schema.sql",
          "src/main/resources/application.properties",
          "Generated automatically by Hibernate",
        ],
        answer: "src/main/resources/db/mysql/schema.sql",
      },
      {
        question: "Can a visit record be edited after it is created?",
        type: "short_answer",
        answer: "No — visits are append-only. There is no edit or delete operation exposed in the UI or the repository.",
      },
    ],
  },
};
