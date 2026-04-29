import Navbar from "./Navbar";

export default function Layout({ children, fullWidth = false }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main
        className={
          fullWidth
            ? "w-full pt-16 sm:pt-20"
            : "mx-auto max-w-6xl px-4 pt-20 pb-10"
        }
      >
        {children}
      </main>
    </div>
  );
}