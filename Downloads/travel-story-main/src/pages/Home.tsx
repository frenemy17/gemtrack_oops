import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Camera, Book, PenTool, Share2, Clock } from 'lucide-react';
import anime from 'animejs';

const Home = () => {
  useEffect(() => {
    // Animate elements on page load with subtle transitions
    anime({
      targets: '.fade-in',
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 800,
      delay: anime.stagger(100),
      easing: 'easeOutQuad'
    });

    // Subtle floating animation for CTAs
    anime({
      targets: '.float-animation',
      translateY: [0, -8],
      direction: 'alternate',
      loop: true,
      duration: 1500,
      easing: 'easeInOutQuad'
    });
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" 
             style={{ backgroundImage: "url('https://images.unsplash.com/photo-1488085061387-422e29b40080?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')", 
                      filter: 'brightness(0.7)' }}>
        </div>
        
        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto fade-in">
            <h1 className="text-5xl md:text-7xl font-light text-white tracking-tight mb-6">
              Document Your <span className="font-semibold">Journey</span>
            </h1>
            
            <p className="text-xl text-white/90 mb-12 font-light">
              A simple, beautiful way to create and share your travel stories.
            </p>
            
            <div className="mt-8 float-animation">
              <Link to="/canvas" className="inline-flex items-center gap-2 bg-white text-gray-900 py-4 px-8 text-lg rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                <Book size={18} />
                Start Creating
              </Link>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-12 left-0 right-0 text-center">
          <div className="animate-bounce inline-block">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center fade-in">
            <h2 className="text-3xl md:text-4xl font-light mb-6">
              Remember every detail of your adventures
            </h2>
            <p className="text-gray-600 mb-12 text-lg">
              Travel Story helps you capture and preserve your travel experiences through beautiful, interactive journals that you can revisit and share.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto mt-16">
            {[
              {
                icon: <Camera className="text-gray-800" />,
                title: "Capture",
                description: "Upload photos from your journey and arrange them in your journal."
              },
              {
                icon: <PenTool className="text-gray-800" />,
                title: "Create",
                description: "Add notes, thoughts, and details to build your travel narrative."
              },
              {
                icon: <Share2 className="text-gray-800" />,
                title: "Share",
                description: "Export your journal as a video or PDF to share with friends and family."
              }
            ].map((feature, index) => (
              <div key={index} className="text-center fade-in">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo/Preview Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12 max-w-6xl mx-auto">
            <div className="md:w-1/2 fade-in">
              <div className="relative">
                <div className="absolute -inset-4 bg-gray-200 rounded-lg transform rotate-3"></div>
                <img 
                  src="https://i.pinimg.com/736x/f7/b3/23/f7b323f8ab5196b78919debae022f39a.jpg" 
                  alt="Journal preview" 
                  className="relative rounded-lg shadow-lg w-full"
                />
              </div>
            </div>
            
            <div className="md:w-1/2 fade-in">
              <h2 className="text-3xl font-light mb-6">
                Designed for <span className="font-medium">storytellers</span>
              </h2>
              <p className="text-gray-600 mb-6">
                Our minimalist canvas gives you the freedom to design your travel journal exactly how you want it. Focus on what matters most: your memories.
              </p>
              
              <ul className="space-y-4 mb-8">
                {[
                  "Clean, distraction-free interface",
                  "Drag and drop photos anywhere on the canvas",
                  "Beautiful typography options",
                  "Add location pins to mark your travels",
                  "Seamless export and sharing"
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              
              <Link to="/canvas" className="inline-flex items-center text-black border-b border-black pb-1 hover:opacity-70 transition-opacity">
                Try it now <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center fade-in mb-16">
            <h2 className="text-3xl md:text-4xl font-light mb-6">
              Simple Process, Beautiful Results
            </h2>
            <p className="text-gray-600 text-lg">
              Creating your travel journal is easy with our intuitive tools.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              {
                number: "01",
                title: "Upload",
                description: "Add your travel photos to the canvas."
              },
              {
                number: "02",
                title: "Arrange",
                description: "Organize your photos and add text elements."
              },
              {
                number: "03",
                title: "Design",
                description: "Customize with colors and typography."
              },
              {
                number: "04",
                title: "Export",
                description: "Save as video or PDF to share with others."
              }
            ].map((step, index) => (
              <div key={index} className="fade-in">
                <div className="text-5xl font-light text-gray-200 mb-4">{step.number}</div>
                <h3 className="text-xl font-medium mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Export Options */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2 fade-in">
                <h2 className="text-3xl font-light mb-6">
                  Share Your <span className="font-medium">Stories</span>
                </h2>
                <p className="text-gray-600 mb-8">
                  When your journal is complete, export it in the format that best suits your needs:
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-3 rounded-full">
                      <Clock size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">Animated Video</h3>
                      <p className="text-gray-600">Create a beautiful animated story with smooth transitions between journal pages.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-3 rounded-full">
                      <Book size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">PDF Export</h3>
                      <p className="text-gray-600">Generate a high-quality PDF that's perfect for printing or digital sharing.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="md:w-1/2 fade-in">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                  <img 
                    src="https://i.pinimg.com/736x/9c/90/79/9c9079a50a34ae68233ce04a2ed1df2f.jpg" 
                    alt="Export preview" 
                    className="rounded-lg shadow-sm mb-4 w-full"
                  />
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">My Japan Trip</h4>
                      <p className="text-gray-500 text-sm">7 pages · 12 photos</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 bg-gray-100 rounded-full">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                      </button>
                      <button className="p-2 bg-gray-100 rounded-full">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-black text-white">
        <div className="container mx-auto px-6 text-center fade-in">
          <h2 className="text-3xl md:text-5xl font-light mb-6">
            Start Your Travel Story Today
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Create a beautiful digital journal of your adventures.
          </p>
          <div className="float-animation">
            <Link to="/canvas" className="inline-flex items-center gap-2 bg-white text-black py-4 px-10 text-lg rounded-full shadow-lg hover:bg-gray-100 transition-colors">
              Create Your Journal
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-lg font-medium">Travel Story</h3>
              <p className="text-gray-500">© {new Date().getFullYear()} All rights reserved</p>
            </div>
            
            <div className="flex gap-6">
              <a href="#" className="text-gray-500 hover:text-black transition-colors">About</a>
              <a href="#" className="text-gray-500 hover:text-black transition-colors">Privacy</a>
              <a href="#" className="text-gray-500 hover:text-black transition-colors">Terms</a>
              <a href="#" className="text-gray-500 hover:text-black transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;