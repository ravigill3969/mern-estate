import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

function Listing() {
  const params = useParams();

  const [listing, setListing] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  SwiperCore.use([Navigation]);
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchListing = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await fetch(`/api/listing/get/${params.id}`);

        const data = await res.json();

        if (data.success === false) {
          setError(data.message);
          setLoading(false);
          return;
        }

        setListing(data);
      } catch (error) {
        setError(error);

        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.id]);

  return (
    <main>
      {loading && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
        </div>
      )}
      {error && (
        <div className="flex h-72 items-center justify-center font-extrabold">
          Something went wrong!
        </div>
      )}

      {listing && !error && !loading && (
        <>
          {listing && !error && !loading && (
            <Swiper navigation>
              {listing.imageUrls.map((url) => (
                <SwiperSlide key={url}>
                  <img
                    src={url}
                    alt="listing"
                    className="w-full h-72 object-cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </>
      )}
    </main>
  );
}

export default Listing;
