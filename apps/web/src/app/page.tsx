import Feed from "@/components/feed/Feed";

export default function Home() {
  return (
    <div className="w-full h-auto flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4 text-black">Pirate Social</h1>
      <Feed />
    </div>
  );
}
