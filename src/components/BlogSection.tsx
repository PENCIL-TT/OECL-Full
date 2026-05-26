import { Calendar, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollAnimation from "./ScrollAnimation";
import { Link } from "react-router-dom"; // ✅ Import Link for navigation

const blogs = [
  {
    id: 1,
    slug: "digital-supply-chain-benefits",
    title: "The advantages of a digital supply chain",
    excerpt: "Explore how digital technologies can transform your supply chain operations for greater efficiency.",
    image: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    date: "September 15, 2023",
    author: "Robert Johnson",
    delay: 0
  },
  {
    id: 2,
    slug: "measuring-success-in-logistics",
    title: "How will you know success when it shows up?",
    excerpt: "Identifying and measuring success in logistics operations through key performance indicators.",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    date: "August 28, 2023",
    author: "Jennifer Adams",
    delay: 200
  },
  {
    id: 3,
    slug: "handling-valuable-goods",
    title: "We carefully handle the valuable goods",
    excerpt: "Our specialized approach to transporting high-value and sensitive cargo with maximum security.",
    image: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    date: "August 10, 2023",
    author: "Michael Chen",
    delay: 400
  },
  {
    id: 4,
    slug: "green-logistics-solutions",
    title: "Green logistics solutions for a greener future",
    excerpt: "Sustainable practices in logistics that reduce environmental impact while maintaining efficiency.",
    image: "https://images.unsplash.com/photo-1605600659873-d808a13e4d9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    date: "July 25, 2023",
    author: "Sarah Green",
    delay: 600
  }
];

const BlogSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <ScrollAnimation className="text-center mb-12">
          <span className="text-kargon-red font-medium text-sm uppercase tracking-wider">FROM OUR BLOG</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Updated articles</h2>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {blogs.map((blog) => (
            <ScrollAnimation key={blog.id} delay={blog.delay} className="blog-card">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg mb-3 line-clamp-2">{blog.title}</h3>
                <p className="text-gray-600 mb-4 text-sm line-clamp-3">{blog.excerpt}</p>
                <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    {blog.date}
                  </div>
                  <div className="flex items-center">
                    <User size={14} className="mr-1" />
                    {blog.author}
                  </div>
                </div>
                <Link
                  to={`/blog/${blog.slug}`}
                  className="text-kargon-red font-medium text-sm flex items-center hover:underline"
                >
                  READ MORE
                  <ArrowRight size={14} className="ml-1" />
                </Link>
              </div>
            </ScrollAnimation>
          ))}
        </div>

        <div className="text-center">
          <Link to="/blog">
            <Button className="bg-kargon-red hover:bg-kargon-red/90 text-white px-6">
              VIEW ALL POSTS
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
