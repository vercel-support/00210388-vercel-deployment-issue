# Lawme Workflows

### @lawme/core

Lawme core is a TypeScript library for running graphs created in Lawme. It is used by the Lawme application, but can also be used in your own applications, so that Rivet can call into your own application's code, and your application can call into Rivet graphs.

### @lawme/server

This a http and websocket server for serving workflow, templates and running the graph executor.

At the moment the Dockerfile is at the root as I am unsure of how to get the dockerfile at apps/server/Docker file with cloud build and the monorepo setup.

### @lawme/app

This is a nextjs app that provides the frontend application and endpoints to serve the application (e.g accounts, users).
## Prerequisites

- **Node.js**: Ensure Node.js is installed on your machine.
- **pnpm**: Install pnpm globally using `npm install -g pnpm`.

## Setup

1. **Clone the repository** and navigate into the project directory:
2. **Install dependencies** with pnpm:
```
pnpm install
```
3. **Environment Setup**: Ensure you have `.env` files at the root and inside `apps/app`.

## Development

### Building the Core Library

The `@lawme/core` library must be built before starting the development servers or building other parts of the project:

```
pnpm run build:core
```
### Start Development Servers

- **For the entire project**:
```
pnpm run dev
```
- **For the frontend only (@lawme/app)**:
```
pnpm run dev:app
```
- **For the server only (@lawme/server)**:
```
pnpm run dev:server
```


## Build & Deploy

- **Build the entire project**:
```
pnpm run build
```
- **Build the frontend (@lawme/app) only**:
```
pnpm run build:app
```
- **Build the server (@lawme/server) only**:
```
pnpm run build:server
```
## Managing Dependencies

- To **add a new dependency** to a specific package or app, navigate to its directory and run
```
pnpm add <package-name>

# For adding a dependency in a workspace only
pnpm add <package-name> --filter <workspace>
```
- To **add a development dependency** at the root level, run from the root directory
```
pnpm add -D <package-name>

# For adding a devdependency in a workspace only
pnpm add -D<package-name> --filter <workspace>
```

## Docker

The Dockerfile is located at the root. Adjust paths or Docker contexts as necessary for your deployment setup.
