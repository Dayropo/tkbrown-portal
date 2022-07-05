import { withSessionRoute } from "../../lib/session"

async function logout(req, res) {
  req.session.destroy()
  res.status(200).send({
    message: "Logged out successfully!",
  })
}

export default withSessionRoute(logout)
