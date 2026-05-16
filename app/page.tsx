import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert mb-32"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-3 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Paste your GitHub Repostiory Link Here.
          </h1>
          <input className="rounded-md border-2 border-white px-1 w-80" type="text" id="repoLink" placeholder="github.com/user/repo"></input>
        </div>
        <div className="mt-4 flex flex-col items-start justify-center gap-1">
          <label>
            <input className="mr-1" type="checkbox" id="documentation" />
            Documentation
          </label>
          <label>
            <input className="mr-1" type="checkbox" id="flowchart" />
            UML/Flowchart
          </label>
          <label>
            <input className="mr-1" type="checkbox" id="quiz" />
            Quiz
          </label>

        </div>
      </main>
    </div>
  );
}
