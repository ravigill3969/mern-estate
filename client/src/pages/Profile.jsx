import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { FaSignOutAlt } from "react-icons/fa";
import { MdDeleteSweep } from "react-icons/md";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import {
  UpdateUserFailure,
  UpdateUserStart,
  UpdateUserSuccess,
  DeleteUserStart,
  DeleteUserSuccess,
  DeleteUserFailure,
  SignOutStart,
  SignOutUserSuccess,
  SignOutUserFailure,
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState();
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [userListing, setUserListing] = useState([]);

  const { loading, error } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const handleFileUpload = async (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + "-" + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Progress function
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      // eslint-disable-next-line no-unused-vars
      (error) => {
        // Error function
        setFileUploadError(true);
      },
      () => {
        // Complete function
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const fileRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(UpdateUserStart());
    try {
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(UpdateUserFailure(data.message));
        return;
      }

      dispatch(UpdateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(UpdateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(DeleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(DeleteUserFailure(data.message));
        return;
      }

      dispatch(DeleteUserSuccess(data));
    } catch (error) {
      dispatch(DeleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    dispatch(SignOutStart());
    try {
      const res = await fetch("/api/auth/signout", {});
      const data = await res.json();
      if (data.success === false) {
        dispatch(SignOutUserFailure(data.message));
        return;
      }
      dispatch(SignOutUserSuccess());
    } catch (error) {
      dispatch(SignOutUserFailure(error.message));
    }
  };

  const handleShowListing = async () => {
    console.log(currentUser._id);
    try {
      setShowListingError(false);
      const res = await fetch(`/api/user/listing/${currentUser._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      setUserListing(data);

      if (data.success === false) {
        return;
      }
    } catch {
      setShowListingError(true);
    }
  };

  const handleDeleteListing = async (listingId) => {
    console.log(listingId);
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success === false) {
        return;
      }
      setUserListing(
        userListing.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <img
          src={formData.avatar || currentUser.avatar}
          alt="avatar"
          className="h-24 w-24 rounded-full object-cover cursor-pointer self-center mt-2"
          onClick={() => fileRef.current.click()}
        />

        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image Upload (image must be less than 2mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-green-700">{filePerc}% uploading</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image uploaded successfully</span>
          ) : (
            ""
          )}
        </p>

        <input
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          className="border p-3 rounded-lg"
          id="username"
        />
        <input
          type="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="border p-3 rounded-lg"
          id="email"
        />
        <input
          type="password"
          placeholder="password"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className="border p-3 rounded-lg"
          id="password"
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 transition disabled:opacity-80"
        >
          {loading ? "Updating..." : "Update"}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95 transition"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>
      <div className="flex mt-5 justify-between">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer flex items-center"
        >
          <MdDeleteSweep /> Delete Account
        </span>
        <span
          onClick={handleSignOut}
          className="text-red-700 cursor-pointer flex items-center"
        >
          <FaSignOutAlt /> Sign out
        </span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700 mt-5">
        {updateSuccess ? "User is updated successfully" : ""}
      </p>
      <button className="text-green-700 w-full" onClick={handleShowListing}>
        Show Listings
      </button>
      <p className="text-red-700 mt-5">
        {showListingError ? "Error showing listings" : ""}
      </p>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold text-center my-7">
          Your Listings
        </h1>
        {
          userListing.length > 0
            ? userListing.map((listing) => (
                <div
                  key={listing._id}
                  className="border rounded-lg p-3 flex justify-between items-center gap-4"
                >
                  <Link to={`/listing/${listing._id}`}>
                    <img
                      src={listing.imageUrls[0]}
                      alt="listing"
                      className="h-16 w-16 object-contain"
                    />
                  </Link>
                  <Link
                    to={`/listing/${listing._id}`}
                    className="flex-1 text-slate-700 font-semibold hover:underline truncate"
                  >
                    <p>{listing.name}</p>
                  </Link>
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => handleDeleteListing(listing._id)}
                      className="text-red-700 uppercase"
                    >
                      Delete
                    </button>
                    <button className="text-green-700 uppercase">Edit</button>
                  </div>
                </div>
              ))
            : "" // Optionally, show this if there are no listings
        }
      </div>
    </div>
  );
}
