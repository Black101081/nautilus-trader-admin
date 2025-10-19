import { trpc } from "@/lib/trpc";

export default function AdminCoreTest() {
  // Test single query
  const { data, isLoading, error } = trpc.nautilusCore.getCoreComponents.useQuery();

  console.log('[AdminCoreTest] Query state:', { data, isLoading, error });

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-500">Error</h1>
        <pre className="mt-4 p-4 bg-gray-100 rounded">
          {JSON.stringify(error, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Core Components Test</h1>
      <pre className="p-4 bg-gray-100 rounded overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

