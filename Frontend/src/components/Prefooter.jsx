export default function PreFooterNewsletter() {
  return (
    <section className="w-full bg-black text-white py-7">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center text-center md:text-left">
          
          {/* Left Heading */}
          <h2 className="text-3xl md:text-4xl font-bold">
            Sign up to our newsletter
          </h2>

          {/* Right Subtext */}
          <p className="text-lg font-medium opacity-90">
            Get our emails for info on new items, sales and more.
          </p>

        </div>
      </div>
    </section>
  );
}
