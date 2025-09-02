import { Calendar, Copy, Eye, PencilLine, Trash2, Share } from "lucide-react";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { removeFromPastes } from "../redux/pasteSlice";
import { FormatDate } from "../utlis/formatDate";

const Paste = () => {
  const pastes = useSelector((state) => state.paste.pastes);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: {
        duration: 0.2
      }
    }
  };

  const handleDelete = (id) => {
    dispatch(removeFromPastes(id));
  };

  const handleShare = async (paste) => {
    try {
      const shareUrl = `${window.location.origin}/pastes/${paste._id}`;
      await navigator.clipboard.writeText(shareUrl);
      
      toast.success("Share link copied to clipboard!", {
        position: 'top-center',
        duration: 2000,
        style: {
          background: '#10B981',
          color: '#fff',
        },
      });
    } catch (error) {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = `${window.location.origin}/pastes/${paste._id}`;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        toast.success("Share link copied to clipboard!");
      } catch (fallbackError) {
        toast.error("Failed to copy share link");
        console.error('Share failed:', error);
      }
    }
  };

  const filteredPastes = pastes.filter((paste) =>
    paste.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full py-10 max-w-[1200px] mx-auto px-5 lg:px-0"
    >
      <div className="flex flex-col gap-y-3">
        {/* Enhanced Search */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: isSearchFocused ? 1.02 : 1,
            boxShadow: isSearchFocused
              ? "0 4px 12px rgba(59, 130, 246, 0.2)"
              : "0 1px 3px rgba(0, 0, 0, 0.1)"
          }}
          transition={{ duration: 0.4 }}
          className="w-full flex gap-3 px-4 py-2 rounded-[0.3rem] border border-[rgba(128,121,121,0.3)] mt-6"
        >
          <input
            type="search"
            placeholder="Search paste here..."
            className="focus:outline-none w-full bg-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
        </motion.div>

        {/* All Pastes Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col border border-[rgba(128,121,121,0.3)] py-4 rounded-[0.4rem]"
        >
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="px-4 text-4xl font-bold border-b border-[rgba(128,121,121,0.3)] pb-4"
          >
            All Pastes
          </motion.h2>

          <motion.div
            className="w-full px-4 pt-4 flex flex-col gap-y-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence mode="popLayout">
              {filteredPastes.length > 0 ? (
                filteredPastes.map((paste) => (
                  <motion.div
                    key={paste?._id}
                    variants={cardVariants}
                    layout
                    whileHover={{
                      y: -4,
                      boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                      transition: { duration: 0.2 }
                    }}
                    className="border border-[rgba(128,121,121,0.3)] w-full gap-y-6 justify-between flex flex-col sm:flex-row p-4 rounded-[0.3rem] bg-white transition-all duration-200"
                  >
                    {/* Content */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="w-[50%] flex flex-col space-y-3"
                    >
                      <p className="text-4xl font-semibold">{paste?.title}</p>
                      <p className="text-sm font-normal line-clamp-3 max-w-[80%] text-[#707070]">
                        {paste?.content}
                      </p>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex flex-col gap-y-4 sm:items-end"
                    >
                      <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                        {/* Edit Button */}
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          whileTap={{ scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                          className="p-2 rounded-[0.2rem] bg-white border border-[#c7c7c7] hover:bg-transparent group hover:border-blue-500"
                        >
                          <a href={`/?pasteId=${paste?._id}`}>
                            <PencilLine
                              className="text-black group-hover:text-blue-500 transition-colors duration-200"
                              size={20}
                            />
                          </a>
                        </motion.button>

                        {/* Delete Button */}
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: -5 }}
                          whileTap={{ scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                          className="p-2 rounded-[0.2rem] bg-white border border-[#c7c7c7] hover:bg-transparent group hover:border-pink-500"
                          onClick={() => handleDelete(paste?._id)}
                        >
                          <Trash2
                            className="text-black group-hover:text-pink-500 transition-colors duration-200"
                            size={20}
                          />
                        </motion.button>

                        {/* View Button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                          className="p-2 rounded-[0.2rem] bg-white border border-[#c7c7c7] hover:bg-transparent group hover:border-orange-500"
                        >
                          <a href={`/pastes/${paste?._id}`} target="_blank" rel="noopener noreferrer">
                            <Eye
                              className="text-black group-hover:text-orange-500 transition-colors duration-200"
                              size={20}
                            />
                          </a>
                        </motion.button>

                        {/* Copy Button */}
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          whileTap={{ scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                          className="p-2 rounded-[0.2rem] bg-white border border-[#c7c7c7] hover:bg-transparent group hover:border-green-500"
                          onClick={() => {
                            navigator.clipboard.writeText(paste?.content);
                            toast.success("Content copied to clipboard!");
                          }}
                        >
                          <Copy
                            className="text-black group-hover:text-green-500 transition-colors duration-200"
                            size={20}
                          />
                        </motion.button>

                        {/* Share Button */}
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: -5 }}
                          whileTap={{ scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                          className="p-2 rounded-[0.2rem] bg-white border border-[#c7c7c7] hover:bg-transparent group hover:border-purple-500"
                          onClick={() => handleShare(paste)}
                          title="Share paste link"
                        >
                          <Share
                            className="text-black group-hover:text-purple-500 transition-colors duration-200"
                            size={20}
                          />
                        </motion.button>
                      </div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="gap-x-2 flex"
                      >
                        <Calendar className="text-black" size={20} />
                        {FormatDate(paste?.createdAt)}
                      </motion.div>
                    </motion.div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                  className="text-2xl text-center w-full text-chileanFire-500 py-20"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    No Data Found
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Paste;
