import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/clerk-sdk-node";

const isProtectedRoute = createRouteMatcher(['/organization(.*)'])
const isPublicRoute = createRouteMatcher(['/'])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    auth().protect();
  }
  if (auth().userId && isPublicRoute(req)) {
    let path = "/select-org";

    if (auth().orgId) {
      path = `/organization/${auth().orgId}`;
    } else {
      // Fetch the user's organizations
      const userId = auth().userId;
      if (!userId) {
        throw new Error("User ID is null");
      }
      const user = await clerkClient.users.getUser(userId);
      const organizations: any[] = Array.isArray(user.publicMetadata.organizationMemberships) ? user.publicMetadata.organizationMemberships : [];

      if (organizations.length > 0) {
        // If the user has organizations, redirect to the first one
        path = `/organization/${organizations[0].organization.id}`;
      } else {
        // Create an organization if the user does not have one
        const organization = await clerkClient.organizations.createOrganization({
          name: "Trello Workspace",
          createdBy: auth().userId ?? "",
        });
        path = `/organization/${organization.id}`;
      }
    }

    const organisationPageUrl = new URL(path, req.url);
    return NextResponse.redirect(organisationPageUrl);
  }
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};