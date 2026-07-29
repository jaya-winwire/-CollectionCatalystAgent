import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { ShieldCheck } from "lucide-react";
import { loginRequest } from "../../auth/msalConfig";

function MicrosoftLogo() {
  return (
    <div className="grid grid-cols-2 gap-[2px] w-[18px] h-[18px] flex-shrink-0">
      <div style={{ backgroundColor: "#F25022" }} />
      <div style={{ backgroundColor: "#7FBA00" }} />
      <div style={{ backgroundColor: "#00A4EF" }} />
      <div style={{ backgroundColor: "#FFB900" }} />
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const { instance } = useMsal();
  const [checkingRedirect, setCheckingRedirect] = useState(true);

  useEffect(() => {
    instance
      .handleRedirectPromise()
      .then((response) => {
        const account = response?.account ?? instance.getAllAccounts()[0];
        if (account) {
          instance.setActiveAccount(account);
          navigate("/dashboard");
        }
      })
      .finally(() => setCheckingRedirect(false));
  }, [instance, navigate]);

  const handleSignIn = () => {
    instance.loginRedirect(loginRequest);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#EEF3F8] p-6"
      style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-10">
        <h1 className="text-3xl font-bold leading-tight text-[#0B3D6B]">
          Welcome to Collection Catalyst Agent
        </h1>
        <p className="text-sm text-gray-500 mt-3">
          Sign in with your Microsoft account to continue
        </p>

        <button
          onClick={handleSignIn}
          disabled={checkingRedirect}
          className="w-full mt-6 h-13 py-3.5 flex items-center justify-center gap-2.5 bg-[#0E5D7F] hover:bg-[#0B4C69] disabled:opacity-60 text-white font-semibold rounded-xl transition-colors"
        >
          <MicrosoftLogo />
          {checkingRedirect ? "Signing you in..." : "Sign in with Microsoft"}
        </button>

        <div className="mt-6 bg-[#F5F9FC] border border-[#DCE8F2] rounded-xl p-4 flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-white border border-[#DCE8F2] flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5 text-[#0B3D6B]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#0B3D6B]">Secure Authentication</p>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">
              Sign in securely using your Microsoft account credentials for seamless
              integration with your organization.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
