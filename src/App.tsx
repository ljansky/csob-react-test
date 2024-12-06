import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import { MainForm } from "./form/MainForm";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      Zde bude formulář <i>form/MainForm.tsx</i>:
      <MainForm />
    </QueryClientProvider>
  );
}

export default App;
