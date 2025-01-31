import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { MapPin } from "lucide-react";

function App(): JSX.Element {
  return (
    <Router>
      <div className="min-h-screen font-sans">
        <header className="bg-blue-600 text-white p-4">
          <nav className="container mx-auto flex justify-between">
            <h1 className="text-2xl font-bold">Shrimple</h1>
            <div>
              <Link className="px-4" to="/">Home </Link>
              <Link className="px-4" to="/about">About </Link>
              <Link className="px-4" to="/contact">Contact </Link>
            </div>
          </nav>
        </header>

        <main className="container mx-auto py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>

        <footer className="bg-gray-800 text-white text-center py-4">
          <p>&copy; 2025 Shrimple. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

function HomePage(): JSX.Element {
  return (
    <div className="text-center">
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Welcome to Shrimple</h2>
        <p className="text-lg">How will Shrimple make shrimping simple?</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded shadow">Water quality prediction</div>
        <div className="bg-blue-100 p-4 rounded shadow">Historical shrimp catch data</div>
        <div className="bg-blue-100 p-4 rounded shadow">Current catch data</div>
      </section>
    </div>
  );
}

function AboutPage(): JSX.Element {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">About Us</h2>
      <p className="text-lg mb-4">
        This project was created to introduce a cost and time effective method of identifying suitable waters for shrimp.
      </p>
      <ul className="list-disc pl-6">
        <li>Team Member 1: Maleesha</li>
        <li>Team Member 2: Chanmini</li>
        <li>Team Member 3: Shaithra</li>
        <li>Team Member 4: Jayathu</li>
      </ul>
    </div>
  );
}

function ContactPage(): JSX.Element {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
      <form className="space-y-4">
        <div>
          <label className="block font-bold" htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Your Name"
          />
        </div>
        <div>
          <label className="block font-bold" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="w-full p-2 border rounded"
            placeholder="Your Email"
          />
        </div>
        <div>
          <label className="block font-bold" htmlFor="message">Message</label>
          <textarea
            id="message"
            className="w-full p-2 border rounded"
            placeholder="Your Message"
          ></textarea>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Send Message
        </button>
      </form>

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-2">Find Us Here:</h3>
        <div className="flex items-center gap-2">
          <MapPin />
          <span>Informatics Institute of Technology, 57 Ramakrishna Rd, Colombo, Sri Lanka</span>
        </div>
        <iframe
          title="map"
          className="w-full h-64 mt-4 border"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.21123402388!2d79.8598505!3d6.8652714999999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25ba4e617b3d9%3A0xd5a3b0418f1cf497!2sInformatics%20Institute%20of%20Technology%20(IIT)!5e0!3m2!1sen!2slk!4v1737946592939!5m2!1sen!2slk"
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
}

export default App;