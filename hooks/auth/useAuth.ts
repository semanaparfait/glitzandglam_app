import { useMutation } from "@tanstack/react-query";

type ApiError = Error & {
  statusCode?: number;
  details?: string[];
};

const throwApiError = async (
  res: Response,
  fallbackMessage: string,
): Promise<never> => {
  let parsedBody: any = null;

  try {
    parsedBody = await res.json();
  } catch {
    parsedBody = null;
  }

  const rawMessage = parsedBody?.message;
  const details = Array.isArray(rawMessage)
    ? rawMessage.filter((item: unknown) => typeof item === "string")
    : [];

  const message =
    details.length > 0
      ? details.join(" | ")
      : typeof rawMessage === "string"
        ? rawMessage
        : fallbackMessage;

  const error = new Error(message) as ApiError;
  error.statusCode = parsedBody?.statusCode ?? res.status;
  error.details = details;

  throw error;
};

const LoginUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const res = await fetch(
    `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    },
  );
  if (!res.ok) {
    return throwApiError(res, "Failed to login");
  }
  return res.json();
};

export const useLoginUser = () => {
  return useMutation({
    mutationFn: LoginUser,
  });
};

const RegisterUser = async ({
  email,
  password,
  phoneNumber,
}: {
  email: string;
  password: string;
  phoneNumber: string;
}) => {
  const res = await fetch(
    `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, phoneNumber }),
    },
  );
  if (!res.ok) {
    return throwApiError(res, "Failed to register");
  }
  return res.json();
};

export const useRegisterUser = () => {
  return useMutation({
    mutationFn: RegisterUser,
  });
};
