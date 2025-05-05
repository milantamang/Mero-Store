
const Footer = () => {
  return (
    <footer className="bg-[#6B705C] text-black py-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4"> Mero-Store</h3>

            <p className="text-sm text-justify">
              Mero-Store is your go-to destination for trendy, high-quality
              clothing. We offer stylish apparel for men, women, and children,
              from casual to formal wear, all at affordable prices. Our
              commitment to quality and customer satisfaction makes us the top
              choice for fashion online.
            </p>
          </div>

          {/* Links Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-4 font-semibold">
              <li>
                <a href="#" className="text-sm hover:underline">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:underline">
                  Shop
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:underline">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:underline">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <p className="text-sm">
              Email:{" "}
              <a href="mailto:info@example.com" className="hover:underline">
                info@example.com
              </a>
            </p>
            <p className="text-sm">Phone: +1 234 567 890</p>
          </div>

          {/* Social Media Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-2xl hover:text-blue-500">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-2xl hover:text-blue-400">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-2xl hover:text-pink-500">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-2xl hover:text-red-500">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-10 border-t pt-6 text-center text-sm">
          <p>&copy; 2024 Your Company. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
