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
      <div className="flex flex-1 flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 md:hidden text-center">
          <span className="text-3xl font-extrabold tracking-tight text-[#1B64F2]">
            ticktock
          </span>
        </div>

        <LoginForm />

        <div className="mt-8 text-center text-xs text-slate-600 md:hidden">
          © 2024 tentwenty. All rights reserved.
        </div>
      </div>

      <div className="hidden md:flex flex-col justify-between bg-[#1B64F2] p-12 lg:p-16 text-white relative overflow-hidden">
        <div />

        <div className="max-w-lg z-10 my-auto">
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-white">
            ticktock
          </h2>
          <p className="text-base lg:text-lg text-white/90 leading-relaxed font-normal">
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
