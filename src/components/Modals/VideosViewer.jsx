import React, { useLayoutEffect } from "react";
import { VscClose } from "react-icons/vsc";
import { MediaSlider } from "../MediaSlider";
import { parseJson } from "../../utils";
import toast from "react-hot-toast";
import { image_base_url } from "../../utils/url";

const VideosViewer = ({ videosViewer, setVideosViewer }) => {
  let data = parseJson(videosViewer?.videos) || [];
  data = data.map((e) => ({ url: image_base_url + e, type: "video" }));

  console.log("data", data);

  const close = () => {
    setVideosViewer({ ...videosViewer, isOpen: false });
  };

  useLayoutEffect(() => {
    if (!data?.length) {
      close();
      toast.error("Videos not found!");
    }
  });

  const styles = {
    backdrop: "fixed inset-0 z-10 bg-black/50",
    close:
      "fixed z-20 mt-3 ml-3 text-3xl text-white cursor-pointer hover:text-gray-200 top-2 right-5",
    container: "fixed inset-x-0 top-0 z-10 w-[80vw] h-[80vh] mt-[6vh] mx-auto",
  };

  return (
    <>
      <div onClick={close} className={styles.backdrop} />
      <button onClick={close} className={styles.close}>
        <VscClose />
      </button>
      <div className={styles.container}>
        <MediaSlider media={data} />
      </div>
    </>
  );
};

export default VideosViewer;
