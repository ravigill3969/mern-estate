import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import ListingItem from "../components/ListingItem";

export default function Home() {
  SwiperCore.use([Navigation]);

  const [offerListings, setOfferListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);

  console.log(offerListings);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const response = await fetch("/api/listing/get?offer=true&limit=4");

        // Check if the response is successful
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        // Set the state for offer listings
        setOfferListings(data);

        // Call fetchRentListings if it's a function
        if (typeof fetchRentListings === "function") {
          await fetchRentListings();
        }
      } catch (error) {
        console.error("Error fetching offer listings:", error);
      }
    };
    fetchOfferListings();

    const fetchRentListings = async () => {
      try {
        const response = await fetch("/api/listing/get?type=rent&limit=4");
        const data = await response.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const response = await fetch("/api/listing/get?type=sale&limit=4");
        const data = await response.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
  }, []);

  return (
    <div className="">
      {/* top */}
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl  mx-auto">
        <h1 className="text-3xl font-bold text-slate-700 lg:text-6xl">
          Find your next <span className="text-slate-500">perfect</span>
          <br />
          place with ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          RaviEstate is the perfect place to find your next perfect place to
          live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link
          to="/search"
          className="text-xs text-blue-800 sm:text-sm font-bold hover:underline"
        >
          Let&#39;s get started
        </Link>
      </div>

      {/* middle */}

      <Swiper navigation>
        {offerListings.map((listing) => {
          console.log(listing.imageUrls[0]); // Check if the image URL is valid
          return (
            <SwiperSlide key={listing._id}>
              <div className="h-[500px]" key={listing._id}>
                <div
                  style={{
                    backgroundImage: `url(${listing.imageUrls[0]})`,
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    height: "100%",
                  }}
                ></div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>



      {/* bottom */}

        <div className="flex flex-col gap-8 my-10 p-3 max-w-6xl  mx-auto">
          {
            offerListings && offerListings.length > 0 && (
              <div>
                <div className="my-3">
                  <h2 className="text-2xl font-semibold text-slate-600">Recent Offers</h2>
                  <Link className="text-sm text-blue-800 hover:underline" to={"/search?offer=true"}>Show more offers</Link>
                </div>
                <div className="flex flex-wrap gap-4">
                  {offerListings.map((listing) => (
                    <ListingItem key={listing._id} listing={listing} />
                  ))}
                  
                </div>
              </div>
            )
          }
          {
            rentListings && rentListings.length > 0 && (
              <div>
                <div className="my-3">
                  <h2 className="text-2xl font-semibold text-slate-600">Recent places for Recent</h2>
                  <Link className="text-sm text-blue-800 hover:underline" to={"/search?type=rent"}>Show more offers</Link>
                </div>
                <div className="flex flex-wrap gap-4">
                  {saleListings.map((listing) => (
                    <ListingItem key={listing._id} listing={listing} />
                  ))}
                  
                </div>
              </div>
            )
          }
          {
            saleListings && saleListings.length > 0 && (
              <div>
                <div className="my-3">
                  <h2 className="text-2xl font-semibold text-slate-600">Recent places for sale</h2>
                  <Link className="text-sm text-blue-800 hover:underline" to={"/search?type=sale"}>Show more offers</Link>
                </div>
                <div className="flex flex-wrap gap-4">
                  {saleListings.map((listing) => (
                    <ListingItem key={listing._id} listing={listing} />
                  ))}
                  
                </div>
              </div>
            )
          }
        </div>



    </div>
  );
}
