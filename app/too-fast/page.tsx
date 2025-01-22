import React from "react";

const Page = () => {
  return (
    <main className="root-container flex min-h-screen flex-col items-center justify-center">
      <h1 className="font-bebas-neue text-5xl font-bold text-light-100">
        Whoa, Slow Down There, Speedy!
      </h1>
      <p className="mt-3 max-w-xl text-center text-light-400">
        Looks like you’re clicking a bit too fast. Don’t worry, we just need a
        moment to catch up. Take a breather and try again in a few seconds. We
        promise we’re not mad. 🙂 If you keep seeing this, feel free to reach
        out at support@example.com. Thanks for your patience—you’re awesome!
      </p>
    </main>
  );
};
export default Page;
