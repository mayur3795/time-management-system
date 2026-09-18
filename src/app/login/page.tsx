import { LoginForm } from '@/components/auth/login-form';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth/auth-options';

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/timesheets');
  }

  return (
    <main className="min-h-screen w-full flex flex-col md:grid md:grid-cols-2 bg-white">
      <div className="flex flex-1 flex-col justify-center items-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-4 sm:mb-6 md:hidden text-center">
          <span className="text-3xl font-extrabold tracking-tight text-brand-blue">
            ticktock
          </span>
        </div>

        <LoginForm />

        <div className="mt-6 sm:mt-8 text-center text-xs text-slate-600 md:hidden">
          © 2024 tentwenty. All rights reserved.
        </div>
      </div>

      <div className="hidden md:flex flex-col justify-between bg-brand-blue p-8 lg:p-16 text-white relative overflow-hidden">
        <div />

        <div className="max-w-md lg:max-w-lg z-10 my-auto">
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight mb-4 lg:mb-6 text-white">
            ticktock
          </h2>
          <p className="text-sm lg:text-lg text-white/90 leading-relaxed font-normal">
            Introducing ticktock, our cutting-edge timesheet web application designed to
            revolutionize how you manage employee work hours. With ticktock, you can
            effortlessly track and monitor employee attendance and productivity from anywhere,
            anytime, using any internet-connected device.
          </p>
        </div>

        <div />
      </div>
    </main>
  );
}
