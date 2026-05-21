import { useAuth } from '../context/AuthContext'

const HomePage = () => {
  const { user, signOut } = useAuth()

  const handleSignOut = () => {
    signOut()
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <section className="flex w-full max-w-[720px] flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-8 text-left shadow-card sm:p-10">
        <div className="inline-flex items-center gap-2 text-[20px] font-bold text-blue-600 tracking-tight">
          ↗ LeadFlow
        </div>
        <h1 className="text-[26px] font-semibold text-slate-900">Dashboard</h1>
        <p className="text-slate-500">
          Welcome back{user?.name ? `, ${user.name}` : ''}. You are signed in and
          ready to manage your pipeline.
        </p>
        <p className="text-sm text-slate-600">Signed in as {user?.email ?? 'your account'}</p>
        <button
          type="button"
          className="inline-flex w-fit items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-blue-600 hover:text-blue-600"
          onClick={handleSignOut}
        >
          Sign out
        </button>
      </section>
    </main>
  )
}

export default HomePage
