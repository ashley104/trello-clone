import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/clerk-sdk-node";

export default clerkMiddleware(async (auth, req) => {
  const isPublicRoute = createRouteMatcher(["/"]);

  if(auth().userId && isPublicRoute(req)) {
    let path = "";

    if (auth().orgId) {
      path = `/organization/${auth().orgId}`;
    } else {
      // Create an organization if the user does not have one
      const organization = await clerkClient.organizations.createOrganization({
        name: "Trello Workspace",
        createdBy: auth().userId ?? "",
      });
      path = `/organization/${organization.id}`;
    }

    const organisationPageUrl = new URL(path, req.url);
    return NextResponse.redirect(organisationPageUrl);
  }

  const isProtectedRoute = createRouteMatcher([
    `/organization/${auth().orgId}(.*)`,
  ]);

  if (!auth().userId && !isPublicRoute(req)) {
    return auth().redirectToSignIn();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};