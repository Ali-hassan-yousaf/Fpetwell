


import React, { useEffect, useState } from "react";

const WorkersApp = () => {
  const [workers, setWorkers] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const CLOUDINARY_UPLOAD_PRESET = "petwell_uploads";
  const CLOUDINARY_CLOUD_NAME = "dq7z2nlgv";

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await fetch("https://pet-well-zuxu.vercel.app/api/worker");
        const data = await response.json();
        setWorkers(data || []);
      } catch (error) {
        console.error("Error fetching workers:", error);
      }
    };
    fetchWorkers();
  }, []);

  const handleImageUpload = async () => {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Image upload error:", error);
      return null;
    }
  };

  const handleAddWorker = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const imageUrl = await handleImageUpload();
    if (!imageUrl) {
      setErrorMessage("Image upload failed. Please try again.");
      setLoading(false);
      return;
    }

    const postDate = new Date().toISOString();

    const newWorker = {
      shopname: "Hardcoded Shop",
      name: "Comm",
      title,
      description,
      image: imageUrl,
      postDate,
    };

    try {
      const response = await fetch("https://pet-well-zuxu.vercel.app/api/worker/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newWorker),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Failed to create post.");
        setLoading(false);
        return;
      }

      setWorkers([...workers, data]);
      setTitle("");
      setDescription("");
      setImageFile(null);
    } catch (error) {
      console.error("Error adding worker:", error);
      setErrorMessage("An unexpected error occurred.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 lg:p-12">
      {/* Header Section */}
      <header className="mb-10 text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
        Pet Owner Community
        </h1>
        <p className="text-lg text-gray-600">
        Connect with other pet owners, share experiences, and get advice from our community.
        </p>
      </header>

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-8 max-w-2xl mx-auto p-4 bg-red-50 text-red-700 rounded-lg text-center">
          {errorMessage}
        </div>
      )}

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {workers
          .filter((worker) => worker.name === "Comm")
          .map((worker) => (
            <article
              key={worker._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {worker.image && (
                <figure className="relative h-56">
                  <img
                    src={worker.image}
                    alt={worker.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </figure>
              )}
              <div className="p-5 space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {worker.title}
                </h3>
                <p className="text-gray-600 line-clamp-3">{worker.description}</p>
                <div className="pt-4 border-t border-gray-100">
                  <dl className="space-y-2 text-sm text-gray-500">
              
                    <div className="flex items-center">
                      <dt className="w-20 font-medium">Posted:</dt>
                      <dd>
                        {new Date(worker.postDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </article>
          ))}
      </div>

      {/* Create Post Form */}
      <section className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 md:p-8">
        <form onSubmit={handleAddWorker} className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
            Create New Post
          </h2>

          {/* Form Inputs */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write your post description..."
                rows="4"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col w-full cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="hidden"
                    required
                  />
                  <div className="w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-indigo-500 transition-colors">
                    <span className="text-indigo-600 font-medium">
                      Click to upload image
                    </span>
                    <p className="text-sm text-gray-500 mt-2">
                      PNG, JPG, JPEG up to 5MB
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating Post...
              </div>
            ) : (
              "Publish Post"
            )}
          </button>
        </form>
      </section>
    </div>
  );
};

export default WorkersApp;
