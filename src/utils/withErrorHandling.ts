import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

export function withErrorHandling(
    handler: (request: HttpRequest, context: InvocationContext) => Promise<HttpResponseInit>
) {
    return async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
        try {
            return await handler(request, context);
        } catch (error) {
            context.log("An error occurred in users:", error);
            return {
                status: 400,
                body: JSON.stringify({ message: "Internal Server Error From Users Azure Function", error: error.message })
                
            };
        }
    };
}
