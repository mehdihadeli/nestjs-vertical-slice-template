# NestJs Vertical Slice Template

[![Backend CI Pipeline](https://github.com/mehdihadeli/nestjs-vertical-slice-template/actions/workflows/ci.yml/badge.svg)](https://github.com/mehdihadeli/nestjs-vertical-slice-template/actions/workflows/ci.yml)

> 💡 A practical api sample based on Vertical Slice Architecture, NestJs, TypeORM and OpenTelemetry.

## Table of Contents

- [NestJs Vertical Slice Template](#nestjs-vertical-slice-template)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Technologies - Libraries](#technologies---libraries)
  - [Set up and Start the Infrastructure](#set-up-and-start-the-infrastructure)
  - [Setup and Start the Backend](#setup-and-start-the-backend)
    - [Install dependencies](#install-dependencies)
    - [Run the project](#run-the-project)
    - [Run tests](#run-tests)
    - [Build Project](#build-project)
    - [Format \&\& Lint](#format--lint)
  - [Using Aspire](#using-aspire)
  - [Application Structure](#application-structure)
  - [🏗️ Backend Folder Structure: Vertical Slice Architecture](#️-backend-folder-structure-vertical-slice-architecture)
    - [🔑 Key Principles of This Vertical Slice Architecture](#-key-principles-of-this-vertical-slice-architecture)

## Features

- ✅ Uses **Vertical Slice Architecture** for feature-based modularity and clear separation of concerns
- ✅ Implements a comprehensive test suite: **Unit Tests**, **Integration Tests**, and **End-to-End (E2E) Tests**
- ✅ Employs **NestJS** as the application framework for scalable server-side development
- ✅ Utilizes **TypeORM** for robust ORM and data access
- ✅ Integrates **OpenTelemetry** and **OpenTelemetry-Collector** for collecting logs, metrics, and distributed
  traces to enhance observability
- ✅ Enforces code quality and standards with **ESLint** and **Prettier**
- ✅ Ensures type safety and modern JavaScript with **TypeScript**
- ✅ Advanced backend [Configuration Management](./backend/src/libs/configurations) based on **env** files and
  **appsettings.
  json** files
- ✅ Facilitates efficient development workflow with scripts, hooks (Husky), and commit linting
- ✅ Using **Swagger** and **Api-Versioning** for application apis
- ✅ Using [Problem Details](/backend/src/libs/core/exceptions) standard for readable details of errors.
- ✅ Using Docker-Compose for our deployment mechanism.
- ✅ Using sortable **uuid v7** for Ids
- ✅ Using **Optimistic Conurrency** based on TypeORM concurrency token
- ✅ Using **Soft Delete** based on TypeORM
- ✅ Integration **Aspire** for hosting application

## Technologies - Libraries

- ✔️ **[`microsoft/TypeScript`](https://github.com/microsoft/TypeScript)** - TypeScript is a language for application-scale JavaScript.
- ✔️ **[`nestjs/nest`](https://github.com/nestjs/nest)** - Nest is a framework for building efficient, scalable Node.js server-side applications
- ✔️ **[`nestjs/cqrs`](https://github.com/nestjs/cqrs)** - A lightweight CQRS module for Nest framework (node.js)
- ✔️ **[`nestjs/typeorm`](https://github.com/nestjs/typeorm)** - TypeORM module for Nest
- ✔️ **[`tada5hi/typeorm-extension`](https://github.com/tada5hi/typeorm-extension)** - This library provides utitlites to create & drop the database, seed the database and apply URL query parameter(s)
- ✔️ **[`nestjs/swagger`](https://github.com/nestjs/swagger)** - OpenAPI (Swagger) module for Nest
- ✔️ **[`open-telemetry/opentelemetry-js`](https://github.com/open-telemetry/opentelemetry-js)** - A framework for collecting traces, metrics, and logs from applications
- ✔️ **[`motdotla/dotenv`](https://github.com/motdotla/dotenv)** - Dotenv is a zero-dependency module that loads environment variables from a .env
- ✔️ **[`PDMLab/http-problem-details`](https://github.com/PDMLab/http-problem-details)** - This library implements HTTP Problem details (RFC 7807) for HTTP APIs
- ✔️ **[`jestjs/jest`](https://github.com/jestjs/jest)** - A javascript framework for testing
- ✔️ **[`testcontainers/testcontainers-node`](https://github.com/testcontainers/testcontainers-node)** - A library to support tests with throwaway instances of Docker containers
- ✔️ **[`faker-js/faker`](https://github.com/faker-js/faker)** - Generate massive amounts of fake (but realistic) data for testing and development
- ✔️ **[`florinn/typemoq`](https://github.com/florinn/typemoq)** - Simple mocking library for JavaScript targeting TypeScript development
- ✔️ **[`ladjs/supertest`](https://github.com/ladjs/supertest)** - High-level abstraction for testing HTTP
- ✔️ **[`eslint/eslint`](https://github.com/eslint/eslint)** - ESLint is a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code
- ✔️ **[`prettier/prettier`](https://github.com/prettier/prettier)** - Opinionated Code Formatter
- ✔️ **[`uuidjs/uuid`](https://github.com/uuidjs/uuid)** - Generate RFC-compliant UUIDs in JavaScript
- ✔️ **[`@fluffy-spoon/substitute`](https://github.com/ffMathy/FluffySpoon.JavaScript.Testing.Faking)** - An NSubstitute port to TypeScript called substitute.js

## Set up and Start the Infrastructure

This project uses a PostgreSQL database running in a Docker container. Start the infrastructure using `make`:

```bash
# Start docker-compose
docker-compose -f ./deployments/docker-compose/docker-compose.yaml up -d

# Stop docker-compose
docker-compose -f ./deployments/docker-compose/docker-compose.yaml down
```

This command will run the PostgreSQL docker container using docker-compose. Ensure Docker is installed and running on your machine.

## Setup and Start the Backend

### Install dependencies

First, we need to install [pnpm](https://pnpm.io/) because we use `pnpm` as our package manager. Then we should install the dependencies:

```bash
npm run install:dependencies
```

### Run the project

```bash
# run backend in dev mode
pnpm run dev:backend

# run backend in debug mode
pnpm run debug:backend
```

After running the project, you can access the Swagger UI at <http://localhost:5000/swagger>.

### Run tests

```bash
# run backend unit tests
pnpm run test:unit:backend

# run backend integration tests
pnpm run test:integration:backend

# run backend e2e tests
pnpm run test:e2e:backend
```

### Build Project

```bash
# build backend
pnpm run build:backend
```

### Format && Lint

```bash
# format code
pnpm run format:backend

# fix backend lints
pnpm run lint:fix:backend

# lint backend
pnpm run lint:backend
```

## Using Aspire

Install the [`Aspire CLI`](https://learn.microsoft.com/en-us/dotnet/aspire/cli/install?tabs=windows) tool:

```bash
# Bash
dotnet tool install -g Aspire.Cli
```

To run the application using the `Aspire App Host` and using Aspire dashboard in the development mode run following command:

```bash
aspire run
```

After running the command, `Aspire dashboard` will be available with all application components.

## Application Structure

In this project, I used [vertical slice architecture](https://jimmybogard.com/vertical-slice-architecture/) and
[feature folder structure](http://www.kamilgrzybek.com/design/feature-folders/):

- We treat each request as a distinct use case or slice, encapsulating and grouping all concerns from front-end to back.
- When we are adding or changing a feature in an application in traditional n-tier architecture, we are typically touching many different "layers" in an application. We are changing the user interface, adding fields to models, modifying validation, and so on. Instead of coupling across a layer, we couple vertically along a slice, and each change affects only one slice.
- We `minimize coupling` between slices and `maximize cohesion` within a slice, ensuring that related code is grouped together logically and independently.
- With this approach, each of our vertical slices can decide for itself how to best fulfill the request. New features only add code, and we're not changing shared code and worrying about side effects.
- By grouping all code related to a feature into a single slice, the architecture improves maintainability and makes it easier to understand and modify individual features without affecting others.
- Testing becomes more straightforward, as each slice encapsulates all logic related to its feature, enabling isolated and effective testing.

![](./assets/vertical-slice-architecture.jpg)

## 🏗️ Backend Folder Structure: Vertical Slice Architecture

Our `backend` is organized using **Vertical Slice Architecture** — where each feature (use case) is a self-contained, end-to-end slice spanning controller, DTO, handler, and data access. This ensures **high cohesion, low coupling**, and easy maintainability.

```bash
backend/
├── 📄 .editorconfig
├── 📄 .eslintignore
├── 📄 .gitignore
├── 📄 .nycrc.json
├── 📄 .prettierignore
├── 📄 .yamllint.yml
├── 📄 eslint.config.mjs
├── 📄 jest.config.ts
├── 📄 lint-staged.config.mjs
├── 📄 nest-cli.json
├── 📄 package.json
├── 📄 pnpm-lock.yaml
├── 📄 prettier.config.js
├── 📄 README.md
├── 📄 tsconfig.build.json
├── 📄 tsconfig.json
├── 📄 tsconfig.prod.json
├── 📄 vitest.config.ts
│
├── 📁 config/
│   ├── 📄 appsettings.development.json
│   ├── 📄 appsettings.json
│   ├── 📄 appsettings.production.json
│   ├── 📄 appsettings.test.json
│   └── 📁 env/
│       ├── 📄 .env.development
│       ├── 📄 .env.production
│       └── 📄 .env.test
│
├── 📁 src/                                      # ✅ APPLICATION SOURCE CODE — Vertical Slices Live Here
│   ├── 📄 main.ts                               # ▶️ Entry point: Bootstraps NestJS application
│   │
│   └── 📁 app/
│       ├── 📄 app.module.ts                     # 🧩 Root module: Imports all bounded contexts (products, health, shared)
│       ├── 📄 app.infrastructure.ts             # ⚙️ Global setup: Middleware, filters, pipes, interceptors (e.g., logging, CORS, error handling)
│       │
│       └── 📁 modules/
│           │
│           ├── 📁 health/
│           │   ├── 📄 health.module.ts          # 🏗️ Module declaring the health endpoint — simple, no vertical slice needed
│           │   └── 📁 health/
│           │       └── 📄 health.controller.ts  # 🌐 HTTP endpoint: GET /health → returns { status: 'ok' }
│           │
│           ├── 📁 products/                     # 🔹 BOUNDED CONTEXT: Product Management — VERTICAL SLICES HERE
│           │   ├── 📄 products.module.ts        # 🧩 Module exports controllers, handlers, repositories — context glue
│           │   ├── 📄 products.mapper.ts        # 🔄 Optional: Maps DTO ↔ Entity (ClassTransformer)
│           │   ├── 📄 products.tokens.ts        # 💡 DI tokens: e.g., `InjectionToken<ProductRepository>`
│           │   │
│           │   ├── 📁 contracts/                # 📜 ABSTRACTIONS — What the domain expects (interfaces)
│           │   │   └── 📄 product-repository.ts # 🖋️ Interface: find(), create(), update() — NO implementation
│           │   │
│           │   ├── 📁 data/                     # 🛠️ IMPLEMENTATIONS — Concrete TypeORM repos & schemas
│           │   │   ├── 📄 product.repository.ts # 🧱 Implements `product-repository.ts` — talks to DB
│           │   │   └── 📄 product.schema.ts     # 🗃️ TypeORM @Entity() schema — defines table structure
│           │   │
│           │   ├── 📁 dtos/                     # 📦 DATA TRANSFER OBJECTS — API request/response shapes
│           │   │   ├── 📄 create-product-dto.ts # ✉️ Shape of POST /products body
│           │   │   ├── 📄 get-product-dto.ts    # ✉️ Shape of GET /products/:id response
│           │   │   └── 📄 get-products-paged-dto.ts # ✉️ Shape of paginated list response
│           │   │
│           │   ├── 📁 entities/                 # 🧬 DOMAIN MODELS — Business objects mapped to DB
│           │   │   └── 📄 product.entity.ts     # 📂 TypeORM entity — represents Product in domain
│           │   │
│           │   └── 📁 features/                 # ✅ VERTICAL SLICES — ONE FOLDER PER USE CASE
│           │       │
│           │       ├── 📁 create-product/       # 🎯 Use Case: Create a new product
│           │       │   ├── 📄 create-product.controller.ts   # 🌐 HTTP entry point (POST /products)
│           │       │   └── 📄 create-product.handler.ts      # 💼 Business logic: Validates, uses repo, returns DTO
│           │       │
│           │       ├── 📁 get-product-by-id/    # 🎯 Use Case: Fetch single product by ID
│           │       │   ├── 📄 get-product-by-id.controller.ts
│           │       │   └── 📄 get-product-by-id.handler.ts
│           │       │
│           │       └── 📁 get-products-by-page/ # 🎯 Use Case: Paginated list of products
│           │           ├── 📄 get-products-by-page.controller.ts
│           │           └── 📄 get-products-by-page.handler.ts
│           │
│           └── 📁 shared/
│               └── 📄 shared.module.ts          # 🔗 Shared guards, interceptors, pipes used across contexts (e.g., AuthGuard)
│
├── 📁 database/                                 # 🗃️ DATABASE & PERSISTENCE LAYER (separated from business logic)
│   ├── 📄 data-source-local.config.ts           # ⚙️ TypeORM config for local dev environment
│   │
│   ├── 📁 factories/                            # 🧪 Test data builders (for integration tests)
│   │   └── 📄 products.factory.ts               # 🧩 Creates realistic test product instances
│   │
│   ├── 📁 migrations/                           # 🛠️ Database schema evolution scripts
│   │   └── 📄 1757367142854-init.ts             # 📜 Generated by TypeORM — tracks DB state changes
│   │
│   └── 📁 seeds/                                # 🌱 Production seed data
│       └── 📄 products-seeder.ts                # 📥 Inserts default products on deployment
│
├── 📁 libs/                                     # 🧰 CROSS-CUTTING INFRASTRUCTURE LIBRARIES — Reusable, project-agnostic
│   ├── 📁 configurations/                       # 📂 App settings loader, typed configs, env parsing
│   ├── 📁 core/                                 # 🧱 Base classes: entities, exceptions, validations, guards
│   ├── 📁 logger/                               # 📝 Logging adapters: Nest, Pino, Winston
│   ├── 📁 opentelemetry/                        # 🕵️ Distributed tracing: spans, metrics, OTLP exporters
│   ├── 📁 postgres-typeorm/                     # 🐘 TypeORM + PostgreSQL integration: modules, subscribers, connection setup
│   ├── 📁 swagger/                              # 📚 OpenAPI/Swagger UI configuration
│   ├── 📁 test/                                 # 🧪 Shared test utilities: bootstrappers, fixtures, respawners
│   ├── 📁 versioning/                           # 🔢 API versioning strategy: header/path-based routing
│   └── 📁 web/                                  # 🌐 HTTP middleware: CORS, response time, compression, security
│
└───📁 test/
    ├───📁 e2e-tests/                                # End-to-end API tests (HTTP level)
    ├───📁 integration-tests/                        # Feature-level tests (with real DB/repo)
    ├───📁 shared/                                   # Common test utilities & fakes
    └───📁 unit-tests/                               # Pure unit tests (isolated handlers/services)
```

### 🔑 Key Principles of This Vertical Slice Architecture

- **✅ Vertical Slices First**:  
  Every feature (`create-product`, `get-product-by-id`, etc.) is a **self-contained folder** under `features/` — containing its own controller, handler, DTO, and associated tests. No shared `controllers/`, `services/`, or `repositories/` folders. Code is grouped by **behavior**, not technical role — making features independently developable, testable, and deployable.

- **✅ Bounded Contexts Isolated**:  
  Modules like `products/` and `health/` are **fully encapsulated bounded contexts**. They depend only on each other through explicit `contracts/` interfaces — never directly on entities, repositories, or implementations. This ensures loose coupling, clear ownership, and safe refactoring.

- **✅ Infrastructure Separated & Abstracted**:  
  Cross-cutting concerns — logging, tracing, config, DB drivers, Swagger, CORS — live exclusively in `libs/`. Business logic in `src/app/modules/` **never imports infra directly**. Instead, it depends on abstractions defined in `contracts/`, enabling easy swapping of implementations (e.g., switching from TypeORM to Prisma) without touching domain code.

- **✅ Test-Driven by Slice**:  
  Every vertical slice has a matching test suite:

  - Unit tests → `test/unit-tests/modules/[context]/features/[feature].test.ts`
  - Integration tests → `test/integration-tests/modules/[context]/features/[feature].test.ts`
  - E2E tests → `test/e2e-tests/modules/[context]/features/[feature].test.ts`  
     Tests mirror the feature structure — ensuring full coverage and fast feedback loops.

- **✅ No Layered Folders**:  
  There are **no global folders** like `controllers/`, `services/`, `dtos/`, or `repositories/` spanning the entire app. All artifacts are **scoped within their context and feature**. This eliminates confusion, prevents “layer creep”, and enforces cohesion.

- **✅ Reusable Infrastructure in `libs/`**:  
  The `libs/` directory contains **application-agnostic, reusable infrastructure packages** (`configurations/`, `core/`, `postgres-typeorm/`, `opentelemetry/`, etc.). These are treated like internal libraries — versioned, tested, and imported by `src/` modules via DI. Ensures consistency across contexts and enables reuse across microservices.

- **✅ Contracts Define Boundaries**:  
  Interfaces in `contracts/` are the **only allowed dependency bridge** between bounded contexts and infrastructure. For example, `products.module` uses `product-repository.ts` (contract), but knows nothing about `product.repository.ts` (implementation). This enforces inversion of control and makes mocking trivial.

- **✅ Domain-Centric Entities & DTOs**:  
  `entities/` represent real-world business objects (e.g., `Product`) with ORM decorators — but remain pure domain models. `dtos/` define API contracts — strictly separate from entities. Mapping is handled explicitly in `mapper.ts` files, avoiding leakage between layers.

- **✅ Database Layer Isolated**:  
  `database/` contains only persistence artifacts: migrations, seeds, factories, and data source config. It is **not imported by business modules** — only by `libs/postgres-typeorm/` and test fixtures. Ensures domain logic remains database-agnostic.
