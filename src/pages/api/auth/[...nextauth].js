import { config } from "@/config";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token) {
  try {
    console.log("Refreshing access token...");

    const formData = new URLSearchParams();
    formData.append("refresh_token", token.refreshToken);

    const response = await fetch(`${config.PYTHON_API_URL}auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    console.log("Token refreshed successfully");

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + 15 * 60 * 1000, // 15 minutes
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.username || !credentials?.password) {
            console.error("Missing credentials");
            return null;
          }

          const { username, password } = credentials;

          // Create URLSearchParams for form data
          const formData = new URLSearchParams();
          formData.append("username", username);
          formData.append("password", password);

          console.log("Attempting login for:", username);

          const res = await fetch(`${config.PYTHON_API_URL}api/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData.toString(),
          });

          console.log("Response status:", res.status);

          if (!res.ok) {
            const errorData = await res.text();
            console.error("Failed login response:", res.status, errorData);
            return null;
          }

          const data = await res.json();
          console.log("Login successful");

          if (data.access_token && data.refresh_token) {
            return {
              id: data.id || data.user_id || "1",
              name: username,
              email: data.email || username,
              accessToken: data.access_token,
              refreshToken: data.refresh_token,
              accessTokenExpires: Date.now() + 15 * 60 * 1000, // 15 minutes from now
            };
          }

          console.error("No tokens in response");
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        console.log("Initial sign in - storing tokens");
        return {
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: user.accessTokenExpires,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        };
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        console.log("Access token still valid");
        return token;
      }

      // Access token has expired, try to update it
      console.log("Access token expired, refreshing...");
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      if (token) {
        session.user = token.user;
        session.accessToken = token.accessToken;
        session.error = token.error;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
export default handler;
