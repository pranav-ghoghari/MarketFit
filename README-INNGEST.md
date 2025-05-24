# Testing Inngest Integration

This guide explains how to test the Inngest integration in your MarketFit Node.js server.

## Prerequisites

1. Make sure you have installed all required packages:
   ```bash
   npm install inngest
   ```

2. Ensure your `.env` file contains the necessary environment variables:
   ```
   OPENROUTER_API_KEY=your_openrouter_api_key
   INNGEST_SIGNING_KEY=your_inngest_signing_key
   ```

## Running the Server

Start your server in development mode:

```bash
npm run dev
```

## Using Inngest Dev Server (Recommended for Local Development)

For local development, it's recommended to use the Inngest Dev Server to monitor and debug your Inngest functions:

1. Install the Inngest CLI globally:
   ```bash
   npm install -g inngest-cli
   ```

2. Run the Inngest Dev Server:
   ```bash
   inngest dev
   ```

3. This will provide a local UI at http://localhost:8288 where you can see your functions and events.

## Testing the API Endpoints

### Test a Single Prompt

Use the following curl command to test processing a single prompt:

```bash
curl -X POST http://localhost:3000/api/inngest-api/test-single \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Tell me about artificial intelligence"}'
```

Or using a tool like Postman:
- Method: POST
- URL: http://localhost:3000/api/inngest-api/test-single
- Headers: Content-Type: application/json
- Body (raw JSON):
  ```json
  {
    "prompt": "Tell me about artificial intelligence"
  }
  ```

### Test Batch Processing

Use the following curl command to test batch processing of multiple prompts:

```bash
curl -X POST http://localhost:3000/api/inngest-api/test-batch \
  -H "Content-Type: application/json" \
  -d '{"prompts": ["What is machine learning?", "Explain neural networks", "How does NLP work?", "What are transformers in AI?", "Explain reinforcement learning"]}'
```

Or using a tool like Postman:
- Method: POST
- URL: http://localhost:3000/api/inngest-api/test-batch
- Headers: Content-Type: application/json
- Body (raw JSON):
  ```json
  {
    "prompts": [
      "What is machine learning?",
      "Explain neural networks",
      "How does NLP work?",
      "What are transformers in AI?",
      "Explain reinforcement learning"
    ]
  }
  ```

## Verifying Results

1. Check the Inngest Dev Server UI at http://localhost:8288 to see the events and function executions.
2. Check your MongoDB database for new entries in the `market_fit_collection` collection.
3. Check your server logs for any errors or success messages.

## Troubleshooting

If you encounter any issues:

1. Make sure your server is running.
2. Verify that the Inngest Dev Server is running.
3. Check that your environment variables are correctly set.
4. Look for error messages in your server logs.
5. Check the Inngest Dev Server UI for any failed function executions.

## Next Steps

Once your tests are successful, you can scale up to processing larger batches of prompts. The current implementation should handle up to 500 requests as mentioned in your requirements.
