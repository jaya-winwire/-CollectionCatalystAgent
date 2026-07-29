import { useLocation } from "react-router-dom";

const WEBCHAT_URL = import.meta.env.VITE_COPILOT_WEBCHAT_URL;

// Persistent Copilot Studio webchat panel. Mounted once at the app shell level
// and toggled with CSS (never unmounted) so the iframe's embedded conversation
// survives route navigation — see main.tsx.
export default function AskArea() {
  const location = useLocation();
  const visible = location.pathname.startsWith("/customer/");

  return (
    <aside
      className={`${visible ? "flex" : "hidden"} fixed top-14 right-0 bottom-0 w-[400px] z-30 flex-col bg-white border-l border-[#DDDDDD]`}
    >
      {/* Copilot Studio webchat */}
      {WEBCHAT_URL ? (
        <iframe
          src={WEBCHAT_URL}
          title="AI Assistant"
          className="h-full w-full border-0"
          allow="microphone"
        />
      ) : (
        <div className="flex-1 flex items-center justify-center p-6 bg-[#FAFBFC]">
          <div className="text-center text-sm text-gray-500 leading-relaxed">
            <p className="font-semibold text-gray-700 mb-2">Copilot Studio agent not configured</p>
            <p>
              Set <code className="bg-gray-100 px-1 py-0.5 rounded text-[12px]">VITE_COPILOT_WEBCHAT_URL</code> in{" "}
              <code className="bg-gray-100 px-1 py-0.5 rounded text-[12px]">.env</code> to the webchat share URL from
              Copilot Studio (Channels → Custom website), then reload.
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
