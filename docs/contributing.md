# Contributing guide

Every module follows the same layout, so each new feature should mirror an existing one. `clients` is the simplest reference and `billing` the most complete.

## Adding a module

The detailed per-layer templates live in [`.github/instructions/`](../.github/instructions/):

| Layer | Instructions | Produces |
|---|---|---|
| Domain | `ddd-domain-layer.instructions.md` | `entities/`, `valueObjects/`, `repositories/I{Model}Repository.ts` |
| Application | `ddd-application-layer.instructions.md` | `services/interfaces/`, `services/implementations/`, `errors/` |
| Infrastructure | `ddd-infrastructure-layer.instructions.md` | `repositories/Prisma{Model}Repository.ts`, `mappers/Prisma{Model}Mapper.ts` |
| Presentation | `ddd-presentation-layer.instructions.md` | `routes/`, `controllers/`, `validators/`, `requests/`, `responses/`, `mappers/` |

Checklist:

1. **Schema:** add the model to `schema.prisma`, run `npx prisma migrate dev --name add_<model>`, then `npx prisma generate`.
2. **Domain:** one value object per attribute, validated in a static `create()`. The entity exposes only getters and intent-revealing methods.
3. **Application:** services depend on repository **interfaces** and throw typed `ApplicationError` subclasses with an HTTP status.
4. **Infrastructure:** repositories should take an optional Prisma transaction client in the constructor (like `PrismaCompaniesRepository`), so Units of Work can reuse them. Mappers convert Prisma rows to entities and back.
5. **Presentation:** a Zod schema for each write endpoint, `asyncHandler` around each controller method, and DTO mappers that keep entities out of responses.
6. **Wiring:** register everything in `src/dependencyInjection/container.ts` (infrastructure → application → presentation) and mount the router in `src/presentation/core/routes/router.ts`.
7. **Plan limits:** if the resource is billable, add it to `LimitedResource` / `PLAN_CATALOG` / `RESOURCE_WINDOWS`, measure it in `UsageService`, and add `enforceLimit("<resource>")` to the create route.

## Conventions

- **Dependency rule:** `domain` imports nothing from the other layers, and `application` never imports Prisma, Express or `ENV`.
- **Path alias:** import with `@/…` (resolved to `src/…`).
- **Errors:** throw, don't `res.status()` from services. The central `errorHandler` maps errors to HTTP responses.
- **Transactions:** a use case that writes more than one aggregate goes through a Unit of Work.
- **Tenancy:** every tenant query filters by `companyId`, taken from `CompanyIdParser`.
- **Secrets:** compare them with `crypto.timingSafeEqual`, and never log tokens, emails or passwords.
- **Language:** code and comments are in English. User-facing error messages are in Spanish (es-CR).
- **Naming:** a few legacy file names contain typos (for example `location.valouObject.ts`). Keep the existing name when editing a file instead of renaming it in an unrelated change.

## Useful commands

```bash
npm run dev                        # hot-reload server
npm run build                      # type-check and compile
npx prisma migrate dev --name x    # create and apply a migration
npx prisma studio                  # browse the database
```
