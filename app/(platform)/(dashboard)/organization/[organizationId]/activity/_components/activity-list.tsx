import { AcityvityItems } from "@/components/activity-items";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server"
import { log } from "console";
import { redirect } from "next/navigation";

export const ActivityList = async () => {
  const { orgId } = auth();

  if (!orgId) {
    redirect("/select-org");
  }

  const auditLogs = await db.auditLog.findMany({
    where: {
      orgId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <ol className="space-y-4 mt-4">
      <p className="hidden last:block text-xs text-center text-muted-forground">
        No activity found inside this organisation
      </p>
      {auditLogs.map((log) => (
        <AcityvityItems key={log.id} data={log} />
      ))}
    </ol>
  );
};

ActivityList.Skeleton = function ActivityListSkeleton() {
  return (
    <ol className="space-y-4 mt-4">
      <Skeleton className="w-[80%] h-14" />
      <Skeleton className="w-[80%] h-14" />
      <Skeleton className="w-[80%] h-14" />
      <Skeleton className="w-[80%] h-14" />
      <Skeleton className="w-[80%] h-14" />
    </ol>
  )
}