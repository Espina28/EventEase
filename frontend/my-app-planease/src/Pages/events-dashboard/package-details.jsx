import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';
import Rose from '../../../public/Rose.png';
import Tulip from '../../../public/Tulip_1-removebg-preview.png';
import CherryBlossom from '../../../public/CherryBlossom.png';
import { saveServicesData } from '../booking-pages/utils/booking-storage.js'

const PackageDetails = () => {

    const { package_name } = useParams();
    const navigate = useNavigate();

    const packages = [
        "Tulip Package","Cherry Blossoms Package","Rose Package"
    ]
    const cherryBlossomsServices = [
        "Catering",
        "Decorations",
        "Bridal Gown (Rental)",
        "Groom Suit (Rental)",
        "Bridal Entourage gown, suit and flowers",
        "2 Tier Wedding Cake",
        "Wine for Toasting",
        "Invitations & Souvenirs",
        "Bridal Car",
        "Sounds & Lights",
        "Professional Host",
        "Doves",
        "Wedding Coordinators",
        "Wedding Makeup",
        "Photobooth",
        "Photography (PreNup & Wedding Day)",
        "Videography (Wedding Day Only)"
    ];

    const tulipServices  = [
        "Catering",
        "Decorations",
        "Bridal Gown (Owned)",
        "Groom Suit (Owned)",
        "Bridal Entourage gown, suit and flowers",
        "4 Tier Wedding Cake and Cupcakes",
        "Wine for Toasting",
        "Invitations & Souvenirs",
        "Bridal Car",
        "Van Service",
        "Sounds & Lights",
        "Professional Host",
        "Doves",
        "Wedding Coordinators",
        "Wedding Makeup",
        "Photobooth",
        "Photography & Videography (PreNup & Wedding Day)",
        "SDE Video",
        "1 Lechon",
        "Mobile Bar",
        "Dessert Station"
    ];

    const roseServices = [
        "Catering",
        "Decorations",
        "Bridal Gown (1st Use)",
        "Groom Suit (1st Use)",
        "Bridal Entourage gown, suit and flowers",
        "3 Tier Wedding Cake",
        "Wine for Toasting",
        "Invitations & Souvenirs",
        "Bridal Car",
        "Van Service",
        "Sounds & Lights",
        "Professional Host",
        "Doves",
        "Wedding Coordinators",
        "Wedding Makeup",
        "Photobooth",
        "Photography & Videography (PreNup & Wedding Day)"
    ];

    useEffect(()=>{
        console.log(package_name);
    },[])

    return (
        <div className="p-6 bg-gray-100 font-sans p-20">
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-500 mb-4">
                <span className="cursor-pointer" onClick={() => navigate("/home")}>
                    Home /
                </span>
                <span className="text-gray-500">&nbsp; {package_name}</span>
            </nav>

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row gap-6 mb-8">
                <div className="d-flex flex-col gap-4">
                    {
                        package_name === "Tulip Package" ? (
                            <div className="bg-[#ECBDCF] rounded-lg flex justify-center items-center p-4 h-[240px] md:h-[320px] lg:h-[400px]">
                                <img
                                    src={Tulip}
                                    alt="Tulip Package"
                                    className="w-full max-w-sm rounded-xl object-cover"
                                />
                            </div>
                        ):package_name === "Cherry Blossoms Package" ? (
                            <div
                                className="rounded-lg flex justify-center items-center p-4 h-[240px] md:h-[320px] lg:h-[400px]"
                                style={{ backgroundImage: `url(${CherryBlossom})` }}
                                role="img"
                                aria-label="Cherry Blossoms Package"
                            />
                        ):
                            <div
                                className="rounded-lg flex justify-center items-center p-4 h-[240px] md:h-[320px] lg:h-[400px]"
                                style={{ backgroundImage: `url(${Rose})` }}
                                role="img"
                                aria-label="Cherry Blossoms Package"
                            />
                    }
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                        {
                           packages
                               .filter((item) => item !== package_name)
                               .map((item, index) => (
                            <div key={index} className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4 hover:cursor-pointer"
                            onClick={() => navigate(`/package/${item}`)}>
                                {
                                    item === "Tulip Package" ? (
                                        <img src={Tulip} alt="Rose" className="w-10 h-10 object-contain"/>
                                    ): item === "Cherry Blossoms Package" ? (
                                        <img src={CherryBlossom} alt="Rose" className="w-10 h-10 object-contain"/>
                                    ): <img src={Rose} alt="Rose" className="w-10 h-10 object-contain"/>
                                }
                                <span className="text-sm font-medium">{item}</span>
                            </div>
                            ))
                        }
                    </div>
                </div>
                <div className="bg-white shadow-sm rounded-xl p-10 flex-1">
                    <h3 className="text-lg text-gray-600 mb-1">200 Pax</h3>
                    <h1 className="text-2xl font-bold text-gray-900">{package_name?.toUpperCase()
                    }</h1>
                    <p className="text-xl text-gray-700 my-4 font-semibold">₱450,000</p>

                    <p className="font-semibold mb-2">What's Included</p>
                    <div className="flex flex-wrap gap-2">
                        {
                            package_name === "Tulip Package" ? (
                                tulipServices.map((item, index) => (
                                    <span
                                        key={index}
                                        className="bg-[#FFE1AC] text-sm px-3 py-1 rounded-full hover:cursor-pointer"
                                    >
                                {item}
                            </span>
                                ))
                            ):
                            package_name === "Cherry Blossoms Package" ? (
                                cherryBlossomsServices.map((item, index) => (
                                    <span
                                        key={index}
                                        className="bg-[#FFE1AC]  text-sm px-3 py-1 rounded-full hover:cursor-pointer"
                                    >
                                    {item}
                                </span>
                                ))
                            ):
                            roseServices.map((item, index) => (
                                <span
                                    key={index}
                                    className="bg-[#FFE1AC] text-sm px-3 py-1 rounded-full hover:cursor-pointer"
                                >
                                {item}
                            </span>
                                ))
                        }
                    </div>

                    <button className="mt-6 w-full lg:w-auto bg-black text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-gray-800 transition hover:cursor-pointer"
                    onClick={() => navigate(`/book/${package_name}/inputdetails`)}>
                        BOOK A WEDDING
                    </button>
                </div>
            </div>
            {/* Footer Icons */}
            <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col sm:flex-row justify-around text-center gap-6">
                <div>
                    <div className="text-2xl mb-1">🛠️</div>
                    <p className="text-sm font-medium">Trusted Professionals</p>
                </div>
                <div>
                    <div className="text-2xl mb-1">✅</div>
                    <p className="text-sm font-medium">Secure & Easy</p>
                </div>
                <div>
                    <div className="text-2xl mb-1">📦</div>
                    <p className="text-sm font-medium">Event-Ready Options</p>
                </div>
            </div>
        </div>
    );
};

export default PackageDetails;
