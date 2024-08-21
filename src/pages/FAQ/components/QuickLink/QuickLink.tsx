// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "./QuickLinkSwiper.css";
import { links } from "./quick_links.json";
import styles from "./QuickLink.module.css";
import { useState } from "react";
import { SlArrowRight } from "react-icons/sl";
import { SlArrowLeft } from "react-icons/sl";
export default function QuickLink() {
  const [swiper, setSwiper] = useState<any>();
  const [reachingEnd, setReachingEnd] = useState<boolean>(false);
  const [reachingFirst, setReachingFirst] = useState<boolean>(true);
  return (
    <div>
      <div className={styles.swiperWrapper}>
        <button
          className={styles.arrowBtn}
          onClick={() => swiper?.slidePrev()}
          disabled={reachingFirst}
          style={{ marginRight: "15px" }}
        >
          <SlArrowLeft style={{ fontSize: "20px" }} />
        </button>
        <Swiper
          modules={[Navigation, A11y, Pagination, Scrollbar]}
          spaceBetween={20}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            40: { slidesPerView: 1 },
            735: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
          onBeforeInit={(swipper) => setSwiper(swipper)}
          onSlideChange={(e) => {
            e.isEnd ? setReachingEnd(true) : setReachingEnd(false);
            e.isBeginning ? setReachingFirst(true) : setReachingFirst(false);
          }}
        >
          {links.map((link, i) => (
            <SwiperSlide key={i} className={styles.swiperSl}>
              <div className={styles.imgWrap}>
                <a href={link.url}>
                  <div
                    className={styles.swiperImg}
                    style={{ backgroundImage: `url(${link.img})` }}
                  ></div>
                </a>
              </div>
              <div className={styles.QlName}>
                <div style={{ fontWeight: "600" }}>{link.name}</div>
                <div>{link.description}</div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <button
          className={styles.arrowBtn}
          onClick={() => swiper?.slideNext()}
          disabled={reachingEnd}
        >
          <SlArrowRight style={{ fontSize: "20px" }} />
        </button>
      </div>
    </div>
  );
}
