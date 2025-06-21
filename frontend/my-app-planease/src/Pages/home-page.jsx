import { Link } from "react-router-dom"

const ServiceCard = ({ image, title, price, link }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md">
      <img src={image || "/placeholder.svg"} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="font-medium text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">Price: {price}</p>
        <Link to={link} className="mt-3 inline-block text-sm text-blue-500 hover:text-blue-700">
          Book Now
        </Link>
      </div>
    </div>
  )
}

const HomePage = () => {
  const services = [
    {
      id: 1,
      image: "/placeholder.svg?height=200&width=300",
      title: "Wedding Event",
      price: "₱5000 - ₱8000",
      link: "/services/wedding",
    },
    {
      id: 2,
      image: "/placeholder.svg?height=200&width=300",
      title: "Construction",
      price: "₱10000 - ₱50000",
      link: "/services/construction",
    },
    {
      id: 3,
      image: "/placeholder.svg?height=200&width=300",
      title: "Catering Service",
      price: "₱3000 - ₱6000",
      link: "/services/catering",
    },
    {
      id: 4,
      image: "/placeholder.svg?height=200&width=300",
      title: "Film Making",
      price: "₱8000 - ₱15000",
      link: "/services/film-making",
    },
    {
      id: 5,
      image: "/placeholder.svg?height=200&width=300",
      title: "Wedding Event",
      price: "₱5000 - ₱8000",
      link: "/services/wedding-premium",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative">
        <img
          src="/placeholder.svg?height=400&width=1200"
          alt="Event Venue"
          className="w-full h-[300px] object-cover rounded-lg mx-auto mt-6 max-w-6xl"
        />
        <div className="absolute inset-0 flex items-center justify-start p-12 max-w-6xl mx-auto">
          <div className="text-white">
            <h1 className="text-4xl font-bold mb-2">
              FIND TRUSTED
              <br />
              PROFESSIONALS
            </h1>
            <p className="text-xl mb-4">FOR YOUR EVENTS</p>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium">
            Find the Best <span className="text-blue-500">Service</span> for your Needs
          </h2>
          <Link to="/services" className="text-sm text-gray-600 hover:text-blue-500">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              image={service.image}
              title={service.title}
              link={service.link}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default HomePage

