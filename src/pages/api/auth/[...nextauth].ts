import axios from "axios";
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token: JWT) {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_OP_URL}/oauth/token`,
      null,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        params: {
          client_id: process.env.OP_CLIENT_ID,
          client_secret: process.env.OP_CLIENT_SECRET,
          grant_type: "refresh_token",
          refresh_token: token.refreshToken,
        },
      }
    );
    const refreshedTokens = res.data;
    console.log("result", res);
    if (!res) {
      throw res;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error(error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export default NextAuth({
  providers: [
    {
      id: "op",
      name: "Open Project",
      type: "oauth",
      clientId: process.env.OP_CLIENT_ID,
      clientSecret: process.env.OP_CLIENT_SECRET,
      authorization: {
        url: `${process.env.NEXT_PUBLIC_OP_URL}/oauth/authorize`,
        params: { scope: "api_v3" },
      },
      token: `${process.env.NEXT_PUBLIC_OP_URL}/oauth/token`,
      userinfo: `${process.env.NEXT_PUBLIC_OP_URL}/api/v3/users/me`,
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          avatar: profile.avatar,
          email: profile.email,
        };
      },
    },
  ],
  secret: process.env.NEXT_AUTH_SECRET,
  callbacks: {
    jwt({ token, account }) {
      if (account?.access_token) {
        return {
          ...token,
          accessToken: account.access_token,
          accessTokenExpires: Date.now() + Number(account.expires_in) * 1000,
          refreshToken: account.refresh_token,
        };
      }
      // Return previous token if the access token has not expired yet
      if (Date.now() < Number(token.accessTokenExpires)) {
        return token;
      }
      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },
    session({ session, token }) {
      session.token = token;
      return session;
    },
  },
});
