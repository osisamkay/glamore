import Image from 'next/image';
import Link from 'next/link';

const PerfectFitSection = ({ images }) => {
  if (!images || images.length < 4) {
    return null; // Don't render if images aren't provided
  }
  return (
    <section className="bg-[#2C2E2F] py-1 pb-10 text-white">
      <div className="container max-w-[1324px] mx-auto px-4 relative">
        <div className="relative h-[683px]">
          {/* Images positioned around the center */}
          <div className="absolute top-0 left-1/4 transform -translate-x-1/2 w-[250px] h-[375px] rounded-lg overflow-hidden">
            <Image src={images[0]} alt="Fashion image 1" fill className="object-cover" />
          </div>
          <div className="absolute top-10 right-0 w-[500px] h-[300px] rounded-lg overflow-hidden">
            <Image src={images[1]} alt="Fashion image 2" fill className="object-cover" />
          </div>
          <div className="absolute bottom-0 left-0 w-[239px] h-[338px] rounded-lg overflow-hidden">
            <Image src={images[2]} alt="Fashion image 3" fill className="object-cover" />
          </div>
          <div className="absolute bottom-0 right-0 w-[239px] h-[338px] rounded-lg overflow-hidden">
            <Image src={images[3]} alt="Fashion image 4" fill className="object-cover" />
          </div>

          {/* Text box in the center */}
          <div className="absolute top-100 right-50 inset-0 flex items-center justify-center">
            <div className="bg-black bg-opacity-50 backdrop-blur-sm px-20 py-10 rounded-3xl max-w-[529px]  text-left mx-4">
              <h2 className="text-2xl font-light mb-4 leading-tight">Perfect Fit Garments, <br /> To Your Specifications</h2>
              <p className="mb-2 text-gray-300">
                From fabrics and buttons to pocket styles and lining colors, personalize your handcrafted look. Take control and feel confident with our Perfect Fit Guarantee.
              </p>
              <Link href="/enquiry" className="bg-gray-300 text-black py-2 px-6 rounded-lg hover:bg-white transition-colors">
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PerfectFitSection;
