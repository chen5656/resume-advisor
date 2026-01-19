import { describe, expect, it, vi } from 'vitest';
import { load, save } from './annotations';

type AnnotationRow = {
    _id: string;
    resumeId: string;
    shapes: string;
    timestamp: number;
};

const createMockDb = () => {
    const tables = {
        annotations: [] as AnnotationRow[],
    };
    let idCounter = 0;

    return {
        tables,
        query: (table: string) => {
            const rows = tables[table as keyof typeof tables];
            if (!rows) {
                throw new Error(`Unknown table: ${table}`);
            }
            return {
                withIndex: (
                    _indexName: string,
                    builder: (q: { eq: (field: string, value: string) => void }) => void,
                ) => {
                    let fieldName: string | null = null;
                    let fieldValue: string | null = null;
                    builder({
                        eq: (field: string, value: string) => {
                            fieldName = field;
                            fieldValue = value;
                        },
                    });
                    return {
                        first: async () => {
                            if (!fieldName) {
                                return rows[0] ?? null;
                            }
                            return (
                                rows.find((row) => (row as Record<string, string>)[fieldName!] === fieldValue) ??
                                null
                            );
                        },
                    };
                },
            };
        },
        insert: async (table: string, value: Omit<AnnotationRow, '_id'>) => {
            const rows = tables[table as keyof typeof tables];
            if (!rows) {
                throw new Error(`Unknown table: ${table}`);
            }
            const id = `${table}_${idCounter++}`;
            rows.push({ _id: id, ...value });
            return id;
        },
        patch: async (id: string, value: Partial<AnnotationRow>) => {
            const rows = tables.annotations;
            const index = rows.findIndex((row) => row._id === id);
            if (index >= 0) {
                rows[index] = { ...rows[index], ...value };
            }
        },
    };
};

describe('annotations', () => {
    it('save inserts a new record when missing', async () => {
        const db = createMockDb();
        const nowSpy = vi.spyOn(Date, 'now').mockReturnValue(1234);

        await save._handler({ db } as any, { resumeId: 'resume-1', shapes: '[]' });

        expect(db.tables.annotations).toHaveLength(1);
        expect(db.tables.annotations[0]).toMatchObject({
            resumeId: 'resume-1',
            shapes: '[]',
            timestamp: 1234,
        });

        nowSpy.mockRestore();
    });

    it('save updates the record when it already exists', async () => {
        const db = createMockDb();
        const nowSpy = vi.spyOn(Date, 'now');

        nowSpy.mockReturnValueOnce(1000);
        await save._handler({ db } as any, { resumeId: 'resume-1', shapes: '[]' });

        nowSpy.mockReturnValueOnce(2000);
        await save._handler({ db } as any, { resumeId: 'resume-1', shapes: '[{\"x\":1}]' });

        expect(db.tables.annotations).toHaveLength(1);
        expect(db.tables.annotations[0]).toMatchObject({
            resumeId: 'resume-1',
            shapes: '[{\"x\":1}]',
            timestamp: 2000,
        });

        nowSpy.mockRestore();
    });

    it('load returns the matching annotation', async () => {
        const db = createMockDb();

        await save._handler({ db } as any, { resumeId: 'resume-1', shapes: '[]' });
        const result = await load._handler({ db } as any, { resumeId: 'resume-1' });

        expect(result?.resumeId).toBe('resume-1');
        expect(result?.shapes).toBe('[]');
    });
});
