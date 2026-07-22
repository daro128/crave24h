const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white px-6 sm:px-10 lg:px-30 py-12 lg:py-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
        <div>
          <h1 className="text-2xl font-bold mb-4 text-[#004953]">
            Crave24h
          </h1>

          <p className="text-gray-300 leading-7">
            Bringing the city's finest flavors directly to your doorstep with
            speed and elegance. Deliciousness, delivered 24/7.
          </p>
        </div>
        <div>
          <h1 className="text-xl font-bold mb-4">Company</h1>

          <div className="flex flex-col gap-3 text-gray-300">
            <p className="hover:text-yellow-400 cursor-pointer transition">About Us</p>
            <p className="hover:text-yellow-400 cursor-pointer transition">Partner With Us</p>
            <p className="hover:text-yellow-400 cursor-pointer transition">Careers</p>
            <p className="hover:text-yellow-400 cursor-pointer transition">Blog</p>
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold mb-4">Support</h1>
          <div className="flex flex-col gap-3 text-gray-300">
            <p className="hover:text-yellow-400 cursor-pointer transition">Help Center</p>
            <p className="hover:text-yellow-400 cursor-pointer transition">FAQ</p>
            <p className="hover:text-yellow-400 cursor-pointer transition">Safety Center</p>
            <p className="hover:text-yellow-400 cursor-pointer transition">Privacy Policy</p>
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold mb-4">Payment Methods</h1>
          <div className="flex flex-col gap-3 text-gray-300 mb-6">
            <p>Credit Cards</p>
            <p>Debit Cards</p>
            <p>PayPal</p>
            <p>Apple Pay</p>
          </div>
          <h2 className="font-semibold mb-3">Subscribe Newsletter</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <input type="email" placeholder="Enter your email" className="flex-1 min-w-0 px-4 py-2 rounded-lg text-black outline-none"/>
            <button className="btn-press bg-[#004953] text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition cursor-pointer">
              Join
            </button>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-12 pt-6 flex flex-col sm:flex-row gap-4 justify-between items-center text-gray-400 text-sm text-center sm:text-left">
        <p>© 2026 Crave24h. All rights reserved.</p>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          <p className="hover:text-white cursor-pointer">Terms of Service</p>
          <p className="hover:text-white cursor-pointer">Privacy Policy</p>
          <p className="hover:text-white cursor-pointer">Cookies</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;