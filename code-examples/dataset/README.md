# Dataset API Example

This example demonstrates how to use ComPilot's Dataset API for managing custom fields and data for entities (Individuals, Companies, Custom).

## Features

### API Calls Supported

#### GET Calls (Real API - compilot.ai)
1. **`GET /datasets`** - List all available datasets
2. **`GET /datasets/{datasetId}/details`** - Get dataset details with custom fields and options
3. **`GET /datasets/{datasetId}/datasetRow`** - List dataset rows with pagination and filtering
4. **`GET /datasets/{datasetId}/{datasetRowId}/details`** - Get specific row values

#### POST/PUT Calls (Real API)
5. **`PUT /{datasetId}/rows/{datasetRowId}/values/batch`** - Update row values with batch operations

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file:
   ```env
   API_URL=https://api.compilot.ai
   API_KEY=your-compilot-api-key
   NEXT_PUBLIC_DEFAULT_DATASET_ID=dataset_UnhR1FLcXGwy
   NEXT_PUBLIC_DEFAULT_DATASET_ROW_ID=datasetr_1MtKTBBvA7Wi
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. **Select an API call** from the dropdown menu
2. **Fill in required parameters** (datasetId, datasetRowId, etc.)
3. **Modify the request body** if needed (for POST/PUT calls)
4. **Click "Execute API Call"** to test the endpoint
5. **View the response** in the response section

## API Configuration

The application now uses the compilot.ai open spec API for all GET calls. Make sure to configure your API credentials in the `.env.local` file.

## API Structure

### Dataset Fields
- **Text fields** - Simple text input
- **Number fields** - Numeric values
- **Date fields** - Date/time values
- **List fields** - Dropdown with predefined options
- **Boolean fields** - True/false values

### Batch Operations
The PUT endpoint supports three operations:
- **INSERT** - Add new values
- **UPDATE** - Modify existing values
- **DELETE** - Remove values

## Project Structure

```
src/
├── app/                    # Next.js app directory
├── components/             # React components
│   └── ApiTester.tsx     # Main API testing interface
├── data/                  # Data and configuration
│   ├── api-calls.ts      # API call definitions
│   └── mock-responses/    # Mock response files
├── types/                 # TypeScript type definitions
│   └── api.ts            # API-related types
```

## Contributing

This example is part of the ComPilot examples repository. Feel free to submit issues or pull requests to improve the documentation or functionality.
