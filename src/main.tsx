import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "./auth/msalInstance";
import ProtectedRoute from "./auth/ProtectedRoute";
import AskArea from "./app/components/AskArea";
import App from "./app/App.tsx";
import Login from "./app/pages/Login.tsx";
import CustomerWorkspace from "./app/pages/CustomerWorkspace.tsx";
import PlaceholderPage from "./app/pages/PlaceholderPage.tsx";
import { Toaster } from "./app/components/ui/sonner";
import "./styles/index.css";

async function bootstrap() {
  await msalInstance.initialize();

  createRoot(document.getElementById("root")!).render(
    <MsalProvider instance={msalInstance}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><App /></ProtectedRoute>} />
          <Route path="/customer/:customerId" element={<ProtectedRoute><CustomerWorkspace /></ProtectedRoute>} />
          <Route path="/collections" element={<ProtectedRoute><PlaceholderPage title="Collections" description="Manage your collection activities and workflows" /></ProtectedRoute>} />
          <Route path="/customers" element={<ProtectedRoute><PlaceholderPage title="Customers" description="View and manage customer information" /></ProtectedRoute>} />
          <Route path="/invoices" element={<ProtectedRoute><PlaceholderPage title="Invoices" description="Track and manage all invoices" /></ProtectedRoute>} />
          <Route path="/ai-assistant" element={<ProtectedRoute><PlaceholderPage title="AI Assistant" description="Your intelligent collection assistant" /></ProtectedRoute>} />
          <Route path="/approvals" element={<ProtectedRoute><PlaceholderPage title="Approvals" description="Review and approve collection actions" /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><PlaceholderPage title="Reports" description="View analytics and reports" /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><PlaceholderPage title="Settings" description="Configure your preferences" /></ProtectedRoute>} />
        </Routes>
        {/* Persistent Copilot Studio chat — mounted once, CSS-toggled by route so the
            iframe conversation survives navigation. Do not move inside a Route. */}
        <AskArea />
        <Toaster />
      </BrowserRouter>
    </MsalProvider>
  );
}

bootstrap();
