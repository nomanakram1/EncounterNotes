import {
    app,
    HttpRequest,
    HttpResponseInit,
    InvocationContext,
  } from "@azure/functions";
  import { container } from "../utils/database";
  import { withErrorHandling } from "../utils/withErrorHandling";
  import { validateRequest } from "../utils/schema";
  
  // Helper function to get the next auto-incremental ID
  async function getNextNoteId(npiNumber): Promise<number> {
    const counterId = "noteCounter";
    
    // Read the counter document
    const { resource: counterDoc } = await container.item(counterId).read();
  
    if (!counterDoc) {
      throw new Error("Counter document not found. Ensure that the counter document exists.");
    }
  
    // Increment the current ID
    const newId = counterDoc.currentId + 1;
    
    // Update the counter document with the new ID
    counterDoc.currentId = newId;
    await container.item(counterId).replace(counterDoc);
  
    return newId;
  }
  
  export async function CreateENote(
    request: HttpRequest,
    context: InvocationContext
  ): Promise<HttpResponseInit> {
    try {
      const body = await request.json();
      const { npiNumber, submittedBy, encounterNote, aiResult, timestamp } = body as any;
  
      // Validate the request using a note-specific schema
      validateRequest(
        {
          npiNumber,
          submittedBy,
          encounterNote,
          aiResult,
          timestamp,
          type: "note",
        },
        "note"
      );
  
      // Generate a new auto-incremental ID
      const newId = await getNextNoteId(npiNumber);
  
      // Create a new note document with the appropriate data
      const newNote = {
        id: `note-${newId}`,
        type: "note",
        npiNumber,
        submittedBy,
        encounterNote,
        aiResult,
        timestamp: timestamp || new Date().toISOString(), // Use provided timestamp or current time
      };
  
      // Attempt to create the document in Cosmos DB
      const { resource: createdNote } = await container.items.create(newNote);
  
      return {
        jsonBody: {
            status: 201,
            message: "Note successfully created",
            note: createdNote,
          }
      };
    } catch (error) {
      console.error("Error creating note:", error);
      return {
        jsonBody: {
            status: 500,
            message: "An error occurred while creating the note. Please try again later.",
          }
      };
    }
  }
  
  app.http("createENote", {
    methods: ["POST"],
    authLevel: "anonymous",
    route: "createENote",
    handler: withErrorHandling(CreateENote),
  });
  