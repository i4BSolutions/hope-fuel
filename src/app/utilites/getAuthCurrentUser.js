import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";

export default async function getAuthCurrentUser() {
  try {
    const { userId } = await getCurrentUser();
    const session = await fetchAuthSession();
    const email = session.tokens.idToken.payload.email;
    return { userId, email };
  } catch (err) {
    if (err === "not authenticated") {
      console.error("User is not authenticated");
    } else {
      console.error("Error fetching authentication details:", err);
    }
  }
}
