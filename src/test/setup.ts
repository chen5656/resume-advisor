import type { ReactNode } from 'react';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

afterEach(() => {
    cleanup();
});

vi.mock('convex/react', () => {
    return {
        ConvexProvider: ({ children }: { children: ReactNode }) => children,
        ConvexReactClient: class {
            constructor(_url: string) {}
        },
        useQuery: vi.fn(),
        useMutation: vi.fn(),
    };
});

vi.mock('../../convex/_generated/api', () => {
    return {
        api: {
            annotations: {
                load: 'annotations.load',
                save: 'annotations.save',
            },
        },
    };
});
