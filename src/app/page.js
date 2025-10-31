"use client"
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter()

  return (
    <main className="h-screen flex justify-center items-center">
      <p className="text-7xl text-white cursor-pointer"
      onClick={() => router.push("/dashboard")}
      
      >Go to Dashboard</p>
    </main>
  );
}
