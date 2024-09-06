import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// eslint-disable-next-line react/prop-types
function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");

  const listing1 = listing;
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user/${listing1.userRef}`);
        const data = await res.json();
        console.log(data);
        setLandlord(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
  }, [listing1.userRef]);

  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span className="font-semibold">{landlord.username}</span>{" "}
            for{" "}
            <span className="font-semibold">{listing1.name.toLowerCase()}</span>
          </p>
          <textarea
            name="message"
            className="w-full border p-3 rounded-lg"
            placeholder="Type your message here"
            id="message"
            rows="2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <Link
            to={`mailto:${landlord.email}?subject=${listing1.name}&body=${message}`}
            className="bg-slate-700 text-white p-3 uppercase rounded-lg text-center hover:opacity-95"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
}

export default Contact;
