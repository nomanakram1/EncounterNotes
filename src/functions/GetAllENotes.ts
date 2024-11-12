import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { container } from "../utils/database";
import { withErrorHandling } from "../utils/withErrorHandling";

export async function GetAllNotes(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const npiNumber = request.params.npiNumber;

    if (!npiNumber) {
      return {
        status: 400,
        jsonBody: { message: "npiNumber is required" },
      };
    }

    const querySpec = {
      query:
        "SELECT * FROM c WHERE c.type = 'note' AND c.npiNumber = @npiNumber",
      parameters: [{ name: "@npiNumber", value: npiNumber }],
    };

    const { resources: notes } = await container.items
      .query(querySpec)
      .fetchAll();

    return {
      status: 200,
      jsonBody: notes,
    };
  } catch (error) {
    console.error("Error fetching notes:", error);
    return {
      jsonBody: {
        status: 500,
        message:
          "An error occurred while fetching notes. Please try again later.",
      },
    };
  }
}

app.http("getAllENotes", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "getAllENotes/{npiNumber}",
  handler: withErrorHandling(GetAllNotes),
});
