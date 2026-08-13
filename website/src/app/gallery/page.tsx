import Image from "next/image";

const gymImages = [
  {
    src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop",
    alt: "Gym equipment and free weights",
  },
  {
    src: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1470&auto=format&fit=crop",
    alt: "Person lifting weights",
  },
  {
    src: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1470&auto=format&fit=crop",
    alt: "Row of treadmills in gym",
  },
  {
    src: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1470&auto=format&fit=crop",
    alt: "Gym interior with bright lights",
  },
  {
    src: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1470&auto=format&fit=crop",
    alt: "Heavy dumbbells on a rack",
  },
  {
    src: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1470&auto=format&fit=crop",
    alt: "Woman stretching in the gym",
  },
];

export const metadata = {
  title: "Gallery",
  description: "Check out our state-of-the-art gym facilities and equipment.",
};

export default function GalleryPage() {
  return (
    <div className="container py-12 md:py-24 lg:py-32">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
          PulseFit Gallery
        </h1>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Explore our premium facilities, modern equipment, and the motivating environment we provide to help you achieve your fitness goals.
        </p>
      </div>

      <div className="mx-auto mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {gymImages.map((image, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-xl bg-muted transition-all hover:shadow-lg"
          >
            <div className="aspect-[4/3] w-full overflow-hidden">
              <Image
                src={image.src}
                alt={image.alt}
                width={800}
                height={600}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                unoptimized // Using unoptimized for external URLs to avoid configuring next.config.js for every domain
              />
            </div>
            <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end">
              <div className="p-4 w-full">
                <p className="text-white font-medium truncate">{image.alt}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
