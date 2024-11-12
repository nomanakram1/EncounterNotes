import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { container } from '../utils/database';
import { withErrorHandling } from "../utils/withErrorHandling";
import { validateRequest } from "../utils/schema";

export async function UpdateNote(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const noteId = request.params.id;
    const npiNumber = request.params.npiNumber;

    if (!noteId || !npiNumber) {
        return {
            jsonBody: {
                status: 400,
                message: "Both id and npiNumber are required"
            }
        };
    }

    try {
        const body = await request.json();
        validateRequest(body, 'note');

        const { resource: existingNote } = await container.item(noteId, npiNumber).read();
        if (!existingNote) {
            return {
                jsonBody: {
                    status: 404,
                    message: "Note not found"
                }
            };
        }

        const updatedNote = { ...existingNote, ...(body as JSON), updatedAt: new Date().toISOString() };
        const { resource: savedNote } = await container.item(noteId, npiNumber).replace(updatedNote);

        return {
            jsonBody: {
                status: 200,
                message: "Note updated successfully",
                data: savedNote
            }
        };
    } catch (error) {
        console.error("Error updating note:", error);
        return {
            jsonBody: {
                status: 500,
                message: "An error occurred while updating the note. Please try again later."
            }
        };
    }
}

app.http('updateNote', {
    methods: ['PUT'],
    authLevel: 'anonymous',
    route: "updateENotes/{npiNumber}/{id}",
    handler: withErrorHandling(UpdateNote)
});
