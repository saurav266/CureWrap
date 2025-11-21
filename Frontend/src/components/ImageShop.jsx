import React, { useEffect, useRef } from "react";
import strach from "../assets/strach.webp";
import workout from "../assets/workout.webp";
import boy from "../assets/insta_img_2.webp";
import man from "../assets/insta_img_3.webp";

const images = [
  { id: 1, src: strach, alt: "Stretch exercise" },
  { id: 2, src: workout, alt: "Workout session" },
  { id: 3, src: boy, alt: "Young boy training" },
  { id: 4, src: man, alt: "Man exercising" },
];

export default function PreHeadingGallery() {
  const refs = useRef([]);

  useEffect(() => {
    refs.current = refs.current.slice(0, images.length);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("opacity-0", "translate-y-6");
            entry.target.classList.add("opacity-100", "translate-y-0");
          }
        });
      },
      { threshold: 0.2 }
    );

    refs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section aria-label="Top gallery" className="relative w-full py-8">

      {/* Full-width static image row */}
      <div className="w-full flex flex-col sm:flex-row items-stretch justify-between gap-0">
        {images.map((img, idx) => (
          <div
            key={img.id}
            ref={(el) => (refs.current[idx] = el)}
            className="
              flex-1 overflow-hidden relative
              transform transition duration-700 ease-out
              opacity-0 translate-y-6
            "
            style={{ transitionDelay: `${idx * 120}ms` }}
          >
          <img
  src={img.src}
  alt={img.alt}
  loading="lazy"
  className="
    w-full 
    h-[300px] sm:h-[320px] md:h-[360px] lg:h-[400px] xl:h-[420px] 
    object-cover block
  "
/>
          </div>
        ))}
      </div>

      {/* Center “Shop Now” button */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <a
  href="/shop"
  className="
    pointer-events-auto 
    bg-green-400 text-white 
    px-6 py-3  text-lg font-medium shadow-lg 
    transition
    hover:bg-white hover:text-black
  "
>
  Shop Now
</a>
      </div>
    </section>
  );
}
