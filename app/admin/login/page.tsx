import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const metadata = { title: "Admin login — bgd" };

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="max-w-sm mx-auto py-12">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
