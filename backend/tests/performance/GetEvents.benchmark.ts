import { GetEventsQueryHandler, GetEventsQuery } from "../../src/application/queries/GetEvents";
import { InMemoryEventRepository } from "../../src/infrastructure/repositories/InMemoryEventRepository";
import { Event } from "../../src/domain/Event";
import crypto from "crypto";
const randomUUID = crypto.randomUUID;

async function runBenchmark() {
    const eventRepository = new InMemoryEventRepository();
    const handler = new GetEventsQueryHandler(eventRepository);

    // Populate with a large number of events
    const TARGET_ORG_ID = "target-org-123";
    const TOTAL_EVENTS = 100000;
    const TARGET_EVENTS_COUNT = 500;

    console.log(`Generating ${TOTAL_EVENTS} events...`);

    for (let i = 0; i < TOTAL_EVENTS; i++) {
        const isTarget = i < TARGET_EVENTS_COUNT;
        const orgId = isTarget ? TARGET_ORG_ID : `other-org-${i % 100}`;

        const event = new Event(
            randomUUID(),
            i + 1,
            `Event ${i}`,
            new Date(),
            new Date(),
            100,
            orgId,
            false,
            {},
            [],
            [],
            "DRAFT"
        );
        await eventRepository.save(event);
    }

    console.log("Starting benchmark...");

    // Warm-up
    for (let i = 0; i < 10; i++) {
        await handler.execute(new GetEventsQuery(TARGET_ORG_ID));
    }

    // Benchmark
    const ITERATIONS = 100;
    const start = process.hrtime.bigint();

    for (let i = 0; i < ITERATIONS; i++) {
        await handler.execute(new GetEventsQuery(TARGET_ORG_ID));
    }

    const end = process.hrtime.bigint();
    const elapsedNs = end - start;
    const elapsedMs = Number(elapsedNs) / 1e6;
    const avgMs = elapsedMs / ITERATIONS;

    console.log(`\nBenchmark Results:`);
    console.log(`Total Time (${ITERATIONS} iterations): ${elapsedMs.toFixed(2)} ms`);
    console.log(`Average Time per execution: ${avgMs.toFixed(2)} ms`);
}

runBenchmark().catch(console.error);
