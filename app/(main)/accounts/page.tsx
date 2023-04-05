import ActiveAccountList from "@/components/accounts/ActiveAccountList";

export default function AccountsPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-4 text-2xl md:text-3xl">Accounts</h1>
      <ActiveAccountList />
    </div>
  );
}
