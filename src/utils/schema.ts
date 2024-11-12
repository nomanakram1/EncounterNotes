export const noteSchema = {
    type: 'object',
    properties: {
        id: { type: 'string' },
        npiNumber: { type: 'string' },
        submittedBy: { type: 'string' },
        encounterNote: { type: 'string' },
        aiResult: { type: 'string' },
        timestamp: { type: 'string', format: 'date-time' }
    },
    required: ['id', 'npiNumber', 'submittedBy', 'encounterNote', 'aiResult', 'timestamp']
};

export function validateRequest(data: any, type: string) {
    const schema = noteSchema;

}
