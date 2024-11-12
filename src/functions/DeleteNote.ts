import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { container } from "../utils/database";
import { withErrorHandling } from "../utils/withErrorHandling";

export async function DeleteNote(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const noteId = request.params.id;
  const npiNumber = request.params.npiNumber;

  if (!noteId || !npiNumber) {
    return {
      jsonBody: {
        data: {
          status: 400,
          message: "Both id and npiNumber are required",
        },
      },
    };
  }

  try {
    const { resource: note } = await container.item(noteId, npiNumber).delete();

    return {
      jsonBody: {
        status: 200,
        message: "Note successfully deleted",
      },
    };
  } catch (error) {
    console.error("Error deleting note:", error);
    return {
      jsonBody: {
        status: 500,
        message:
          "An error occurred while deleting the note. Please try again later.",
      },
    };
  }
}

app.http("deleteNote", {
  methods: ["DELETE"],
  authLevel: "anonymous",
  route: "eNotes/{npiNumber}/{id}",
  handler: withErrorHandling(DeleteNote),
});
