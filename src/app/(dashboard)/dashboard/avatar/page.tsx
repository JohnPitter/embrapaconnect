import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAvatarConfig } from "@/services/avatar.service";
import { AvatarBuilder } from "@/components/avatar/avatar-builder";
import { Header } from "@/components/layout/header";
import { User } from "lucide-react";

export default async function AvatarPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const avatarConfig = await getAvatarConfig(session.user.id);

  return (
    <>
      <Header title="Meu Avatar" breadcrumb={["Dashboard", "Meu Avatar"]} />
      <div className="p-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-accent/10">
              <User className="h-5 w-5 text-mid-green" />
            </div>
            <div>
              <h1 className="font-display text-[24px] font-bold text-dark-base">
                Meu Avatar
              </h1>
              <p className="text-[14px] text-gray-500">
                Personalize seu agricultor virtual
              </p>
            </div>
          </div>
        </div>
        <AvatarBuilder initialConfig={avatarConfig} />
      </div>
    </>
  );
}
