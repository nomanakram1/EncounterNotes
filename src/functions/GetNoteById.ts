import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { container } from '../utils/database';
import { withErrorHandling } from "../utils/withErrorHandling";

export async function GetNoteById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const id = request.params.id;
    const npiNumber = request.params.npiNumber;

    if (!id || !npiNumber) {
        return {
            jsonBody: { 
                status: 400,
                message: "Both id and npiNumber are required" 
            }
        };
    }

    try {
        const { resource: note } = await container.item(id, npiNumber).read();

        if (!note) {
            return {
                jsonBody: { 
                    status: 404,
                    message: "Note not found"
                 }
            };
        }

        return {
            jsonBody: {
                status: 200,
                data: note
            }
        };
    } catch (error) {
        console.error("Error fetching note:", error);
        return {
            status: 500,
            jsonBody: { message: "An error occurred while fetching the note. Please try again later." }
        };
    }
}

app.http('getNoteById', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: "notes/{npiNumber}/{id}",
    handler: withErrorHandling(GetNoteById)
});
