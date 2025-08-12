import Image from 'next/image';
import Link from 'next/link';

const PerfectFitSection = () => {
  return (
    <section className="bg-[#2C2E2F] py-20 text-white">
      <div className="container max-w-[1324px] mx-auto px-4 relative">
        <div className="relative h-[600px]">
          {/* Images positioned around the center */}
          <div className="absolute top-0 left-1/4 transform -translate-x-1/2 w-[250px] h-[375px] rounded-lg overflow-hidden">
            <Image src="/Women's GGF Photos/Ankara Bliss Gown, homepage.jpg" alt="Fashion image 1" layout="fill" objectFit="cover" />
          </div>
          <div className="absolute top-10 right-0 w-[450px] h-[300px] rounded-lg overflow-hidden">
            <Image src="/Women's GGF Photos/three-women.jpg" alt="Fashion image 2" layout="fill" objectFit="cover" />
          </div>
          <div className="absolute bottom-20 left-0 w-[300px] h-[450px] rounded-lg overflow-hidden">
            <Image src="/Women's GGF Photos/Red Jumpsuit.jpg" alt="Fashion image 3" layout="fill" objectFit="cover" />
          </div>
          <div className="absolute bottom-0 right-1/4 w-[250px] h-[375px] rounded-lg overflow-hidden">
            <Image src="/Men's GGF Photos/Vibe Agbada.jpg" alt="Fashion image 4" layout="fill" objectFit="cover" />
          </div>

          {/* Text box in the center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black bg-opacity-50 backdrop-blur-sm p-10 rounded-3xl max-w-md text-center mx-4">
              <h2 className="text-4xl font-light mb-4 leading-tight">Perfect Fit Garments, <br /> To Your Specifications</h2>
              <p className="mb-6 text-gray-300">
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
