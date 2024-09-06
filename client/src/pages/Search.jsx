import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Search() {
  const navigate = useNavigate();
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "", // Fix typo here
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "createdAt",
    order: "desc",
  });
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);

  console.log(listings)

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTerm = urlParams.get("searchTerm");
    const type = urlParams.get("type");
    const parking = urlParams.get("parking");
    const furnished = urlParams.get("furnished");
    const offer = urlParams.get("offer");
    const sort = urlParams.get("sort");
    const order = urlParams.get("order");
    if (searchTerm || type || parking || furnished || offer || sort || order) {
      setSidebarData({
        searchTerm: searchTerm || "",
        type: type || "all",
        parking: parking === "true" ? true : false,
        furnished: furnished === "true" ? true : false,
        offer: offer === "true" ? true : false,
        sort: sort || "createdAt",
        order: order || "desc",
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      try {
        const searchParams = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchParams}`);
        const data = await res.json();
        setListings(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };

    fetchListings();
  }, []);

  const handleChange = (e) => {
    const { id, value, checked } = e.target;

    if (id === "all" || id === "rent" || id === "sale") {
      setSidebarData((prev) => ({
        ...prev,
        type: id,
      }));
    }

    if (id === "searchTerm") {
      setSidebarData((prev) => ({
        ...prev,
        searchTerm: value, // Fix typo here
      }));
    }

    if (id === "parking" || id === "furnished" || id === "offer") {
      setSidebarData((prev) => ({
        ...prev,
        [id]: checked, // Fix boolean handling for checkboxes
      }));
    }

    if (id === "sort_order") {
      const [sort, order] = value.split("_"); // Fix split usage
      setSidebarData((prev) => ({
        ...prev,
        sort: sort || "createdAt",
        order: order || "desc",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("type", sidebarData.type);
    urlParams.set("parking", sidebarData.parking);
    urlParams.set("furnished", sidebarData.furnished);
    urlParams.set("offer", sidebarData.offer);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("order", sidebarData.order);
    const searchQuery = urlParams.toString();

    navigate(`/search?${searchQuery}`);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 sm:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Search </label>
            <input
              type="text"
              id="searchTerm" // Correct ID
              placeholder="Search"
              className="border rounded-lg p-3 w-full"
              value={sidebarData.searchTerm} // Fix typo here
              onChange={handleChange}
            />
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                checked={sidebarData.type === "all"}
                onChange={handleChange}
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.type === "sale"}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.offer} // Boolean handling fixed
              />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.parking} // Boolean handling fixed
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.furnished} // Boolean handling fixed
              />
              <span>Furnished</span>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <label className="font-semibold">Sort:</label>
            <select
              id="sort_order"
              className="border rounded-lg p-3 w-full"
              value={`${sidebarData.sort}_${sidebarData.order}`}
              onChange={handleChange}
            >
              <option value="regularPrice_desc">Price - High to Low</option>
              <option value="regularPrice_asc">Price - Low to High</option>
              <option value="createdAt_desc">Oldest</option>
              <option value="createdAt_asc">Latest</option>
            </select>
          </div>

          <button className="bg-slate-700 text-white p-3 rounded-lg hover:opacity-95">
            Search
          </button>
        </form>
      </div>

      <div className="">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Listing Results
        </h1>
      </div>
    </div>
  );
}

export default Search;
