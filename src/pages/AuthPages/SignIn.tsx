import { Navigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";
import { useAuth } from "../../hooks/useAuth";

export default function SignIn() {
  const { loading, authenticated } = useAuth();

  if (!loading && authenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <PageMeta
        title="SignIn Dashboard | CMPNION"
        description="Sign in to the CMPNION Hotel Service Management Dashboard to monitor, manage, and process guest service requests efficiently."
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
