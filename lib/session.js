import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next"

export const sessionOptions = {
  cookieName: "tkbrown_sessions",
  password: "19e38401-f5b3-41a5-ac21-7a98b5753ce5",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production" ? true : false,
    maxAge: 60 * 60,
  },
}

export function withSessionRoute(handler) {
  return withIronSessionApiRoute(handler, sessionOptions)
}

export function withSessionSsr(handler) {
  return withIronSessionSsr(handler, sessionOptions)
}
